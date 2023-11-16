import pandas as pd
import numpy as np
import os
import sys
import dpsimpy
from dpsim import matpower
import datetime
import interface_db
import interface_postgres

global sim

def read_mpc_file():
    global system
    global meters_assets_dict
    ret = 0
    error = 'Success'
    #meters_assets_dict={'W0':[], 'W1':[], 'W2':[], 'W3': ['aggregated Load 2'], 'W4': ['aggregated Load 3'], 'W5':['aggregated Load 4'], 'W6': ['aggregated Load 4']}
    meters_assets_dict={'W0':[], 'W1':[], 'W2':[], 'W3': ['load2'], 'W4': ['load3'], 'W5':['load4'], 'W6': ['load4']}
    # Reader(mpc_file_path): mpc_file_path is relative to the Notebook dir
    try:
        mpc_reader = matpower.Reader('../network_model/load_flow_pilot_district_mpc_struct_insp.mat', 'mpc')
        system = mpc_reader.load_mpc()
    except FileNotFoundError:
        ret = -1
        error = 'MPC file not found'
    return ret, error

def dpsim_simulation_setup(start_date, end_date):
    global sim
    global system
    #sim_name = 'pilot_uc6'
    start = str(start_date)
    end = str(end_date)
    sim_name = '_' + start.replace('-', '_') + '__' + end.replace('-', '_')
    dpsimpy.Logger.set_log_dir('logs/' + sim_name)
    csv_name = 'logs/' + sim_name + '/' + sim_name + '.csv'
    logger = dpsimpy.Logger(sim_name)

    for node in system.nodes:
        logger.log_attribute(node.name()+'.V', 'v', node)
        logger.log_attribute(node.name()+'.S', 's', node)

    # Parametrize and run simulation
    sim = dpsimpy.Simulation(sim_name, dpsimpy.LogLevel.off)
    sim.set_system(system)
    sim.set_time_step(1)
    sim.set_final_time(len(interface_db.user_requested_timestamps))
    sim.set_domain(dpsimpy.Domain.SP)
    sim.set_solver(dpsimpy.Solver.NRP)
    sim.do_init_from_nodes_and_terminals(False)
    sim.add_logger(logger)
    sim.start()
    print("The simulation started...")
    for component in system.components:
        print(component.name())
    return csv_name

def get_meter_values(processed_power_df, timestamp, meter):
    try:
        P= processed_power_df[(processed_power_df['id']==meter) & (processed_power_df['datetime']==timestamp)].iloc[0]['positive_active']
        Q= processed_power_df[(processed_power_df['id']==meter) & (processed_power_df['datetime']==timestamp)].iloc[0]['positive_reactive']
        return [P,Q]
    except:
        #print('[', timestamp, ']', '[', meter, ']', 'Warn: no available measurement dropping simulation step')
        raise ValueError("There is no available measurement in this timestep")
        #return ['nan', 'nan']

def pq_assign_dpsim(timestamp):
    """
    take pq values of measurements and set the values in the DPSim to the corresponding asset
    """
    kw_w= 1e3
    global meters_assets_dict
    global sim
    for k, v in meters_assets_dict.items():
        meter= k
        assets= v
        
        for asset in v:
            P_set=0
            Q_set =0
            [P_meter,Q_meter]=get_meter_values(interface_db.processed_power_df, timestamp, meter)

            P_set = P_set + (P_meter/3) # check if power is single or three phase, if RMS or absolute value etc.?
            Q_set = Q_set + (Q_meter/3)
        
            #print('[', timestamp, ']', '[', meter, ']', '[', asset, ']', 'Info: assigning [P,Q] values', P_set, Q_set)

            sim.get_idobj_attr(asset, 'P').set(P_set*kw_w)
            sim.get_idobj_attr(asset, 'Q').set(Q_set*kw_w)

def main_simulation_loop(result_file):
    global sim_timesteps
    global sim
    sim_timesteps=[]
    ret = 0
    for dttm in interface_db.user_requested_timestamps:
            try:
                pq_assign_dpsim(dttm)
                sim_timesteps.append(dttm.to_pydatetime())
                #print (dttm.to_pydatetime())
            except ValueError:
                pass
                #print('[',dttm,'] Current timestep was ignored due to one or more measurements missing')
            sim.next()
    sim.next()
    # write results to csv
    interface_postgres.create_table_from_csv(result_file)

