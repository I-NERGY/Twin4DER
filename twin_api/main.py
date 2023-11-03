from fastapi import FastAPI
from fastapi.responses import Response, JSONResponse


description = """
Twin4DER API helps you to make electrical network simulations easier.

Find us on [github](https://github.com/I-NERGY/Twin4DER).

## Database connection

You can **connect to the database**.

## Database actions

You will be able to:

* **Get the available dates**.
* **Get power data for a specific date interval**.
"""

import datetime

from bson.json_util import dumps, loads

import interface_db
import interface_dpsim
import interface_postgres


tags_metadata = [
    {
        "name": "initialize database",
        "description": "Operations with the database: The **initialization** logic is here.",
    },
    {
        "name": "get selectable dates",
        "description": "Retrieves the dates where there is data available coming from the power measurement devices.",
    },
    {
        "name": "get power measurements between dates",
        "description": "Retrieves the power measurement data available between two dates.",
    },
    {
        "name": "get curated power measurements between dates",
        "description": "Retrieves the power measurement data available between two dates, and filters the invalid data.",
    },
    {
        "name": "initialize circuit",
        "description": "Operations with the simulator: The **circuit initialization** logic is here.",
    },
        {
        "name": "retrieve simulation data",
        "description": "Operations with the database: The **data** required for the simulation is retrieved.",
    },
    {
        "name": "configure simulation",
        "description": "Operations with the simulator: The **simulation configuration** logic is here.",
    },
    {
        "name": "run step-wise simulation",
        "description": "Operations with the simulator: The **simulation loop** runs all the steps and stores results.",
    },
]

app = FastAPI(
   title="Twin4DER API",
   description=description,
   summary="An interface for the Twin4DER - DPsim-based Digital Twin",
   contact={
        "name": "Institute for Automation of Complex Power Systems",
        "url": "https://www.acs.eonerc.rwth-aachen.de",
        "email": "post_acs@eonerc.rwth-aachen.de",
   },
   license_info={
        "name": "Mozilla Public License, version 2.0",
        "identifier": "MPL-2.0",
   },
   openapi_tags=tags_metadata,
   version="0.1.0",
)


@app.get('/connection/collections/initialize', tags=["initialize database"])
def connect_to_database():
   global current_collection, power_collection, voltage_collection
   global db
   credentials=interface_db.read_credentials()
   db=interface_db.create_connection(credentials)
   current_collection, power_collection, voltage_collection = interface_db.create_collections(db,credentials)
   return {"message" : "The database connection was created and the collections are loaded.", 
           "success" : True}

@app.get('/postgres/version', tags=["get postgres version"])
def connect_to_database():
   retVal, retString = interface_postgres.connect_postgres()
   if retVal == 0:
      return JSONResponse(status_code=200, content={"message" : "Connecting to postgres works!"})
   elif retVal == -1:
      return JSONResponse(status_code=401, content={"message" : "Connecting to postgres failed!"})
   else:
      return JSONResponse(status_code=500, content={"message" : "Connecting to postgres failed, unknown error!"})

@app.get('/connection/collections/power/selectable-dates', tags=["get selectable dates"])
def get_selectable_dates_for_power_measurements():
   global power_collection
   try:
      sel_dates=interface_db.get_selectable_dates(power_collection)
      suc_rq=True
   except:
      sel_dates="There was an error with the retrieval of the dates"
      suc_rq=False
   return {
      "message" : "Selectable dates are loaded.",
      "dates": sel_dates,
      "success": suc_rq
   }

@app.get('/connection/collections/power/dates/{initial_date}/{final_date}', tags=["get power measurements between dates"])
def get_power_selected_dates(initial_date : datetime.date, final_date : datetime.date):
   global power_collection
   info_dates={'X-begin-selection' : initial_date.isoformat(), 'X-end-selection' : final_date.isoformat(), 'success' : str(True)}
   result_list=interface_db.get_data_between_dates(power_collection,initial_date.isoformat(),final_date.isoformat())
   result_json=dumps(result_list, indent = 4)
   return Response(
      content=result_json, 
      headers=info_dates,
      media_type="application/json"
   )

@app.get('/connection/collections/power/dates/{initial_date}/{final_date}/curated', tags=["get curated power measurements between dates"])
def get_power_selected_dates_curated(initial_date : datetime.date, final_date : datetime.date):
   global power_collection
   info_dates={'X-begin-selection' : initial_date.isoformat(), 'X-end-selection' : final_date.isoformat(), 'success' : str(True)}
   result_power_raw=interface_db.get_data_between_dates_raw(power_collection,initial_date.isoformat(),final_date.isoformat())
   result_list=interface_db.process_query_power_data(result_power_raw)
   result_json=dumps(result_list, indent = 2)
   return Response(
      content=result_json, 
      headers=info_dates,
      media_type="application/json"
   )

@app.get('/simulation/dpsim/initialize', tags=["initialize circuit"])
def read_simulation_circuit():
   interface_dpsim.read_mpc_file()
   return {"message" : "The electrical circuit is loaded.", 
           "success" : True}

@app.get('/simulation/dpsim/getdata/{initial_date}/{final_date}', tags=["retrieve simulation data"])
def retrieve_simulation_data(initial_date : datetime.date, final_date : datetime.date):
   interface_db.process_selected_timestamps(data_collection=power_collection,
                                            start_date_selection=initial_date.isoformat(),
                                            end_date_selection=final_date.isoformat())
   return {"message" : "The simulation initial data retrieval is done.", 
           "success" : True}

@app.get('/simulation/dpsim/configure', tags=["configure simulation"])
def configure_simulation_parameters():
   interface_dpsim.dpsim_simulation_setup()
   return {"message" : "The simulation setup is done.", 
           "totalTimesteps" : len(interface_db.user_requested_timestamps),
           "success" : True}

@app.get('/simulation/dpsim/run/steps', tags=["run step-wise simulation"])
def run_stepwise_simulation():
   interface_dpsim.main_simulation_loop()
   return {"message" : "The simulation setup is running.", 
           "totalTimesteps" : len(interface_db.user_requested_timestamps),
           "success" : True} running.", 
           "totalTimesteps" : len(interface_db.user_requested_timestamps),
           "success" : True}