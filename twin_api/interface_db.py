import json
import pymongo
import sys
from pymongo import MongoClient
import pandas as pd
import datetime
from bson.json_util import dumps, loads


def read_credentials():
    # Opening JSON file
    with open('../credentials/credentials.json', 'r') as openfile:
        # Reading from json file
        credentials = json.load(openfile)
    return credentials

def create_connection(credentials):
    db = MongoClient(credentials['pymongo_url'], 
                    credentials['pymongo_port'], 
                     username=credentials['pymongo_username'],
                     password=credentials['pymongo_password']).get_database(credentials['pymongo_database_name'])
    return db

def create_collections(db, credentials):
    current_collection = eval(credentials['meter_current_name'])
    power_collection = eval(credentials['meter_power_name'])
    voltage_collection = eval(credentials['meter_voltage_name'])

    return [current_collection, power_collection, voltage_collection]

def create_csv_current(current_collection):
    current_df = pd.DataFrame(current_collection.find())
    current_df.to_csv('current_new.csv')
    return True

def get_selectable_dates(data_collection):
    selectable_dates=sorted(data_collection.distinct("date"), key=lambda x: datetime.datetime.strptime(x, "%Y-%m-%d"))
    return selectable_dates

def get_data_between_dates(data_collection,start_date_selection,end_date_selection):
    user_query = { "date": { "$gte": start_date_selection , "$lte": end_date_selection}}
    user_query_result = data_collection.find(user_query)
    result_list=list(user_query_result)
    return result_list

def get_data_between_dates_raw(data_collection,start_date_selection,end_date_selection):
    user_query = { "date": { "$gte": start_date_selection , "$lte": end_date_selection}}
    user_query_result = data_collection.find(user_query)
    return user_query_result

def process_query_power_data(user_query_result):
    power_df = pd.DataFrame(user_query_result)
    db_columns=list(power_df.columns.values)
    time_format = "%H:%M:%S"
    db_times=[]
    db_colums_withoutTime=[]
    for col in db_columns:
        try:
            db_times.append(datetime.datetime.strptime(col, time_format).time())
        except ValueError:
            db_colums_withoutTime.append(col)

    header=[times.strftime("%H:%M:%S") for times in db_times]

    melted_df=pd.melt(power_df, id_vars=['date', 'id', 'power_type'], value_vars=header, var_name='time', value_name='power')
    pivoted_df=pd.pivot_table(melted_df, values='power', columns='power_type', index=['date', 'time', 'id'])\
                .reset_index()
    pivoted_df.columns.name=None
    pivoted_df.insert(loc=0, column='datetime', value=pd.to_datetime(pivoted_df['date'] + ' ' + pivoted_df['time'], format="%Y-%m-%d %H:%M:%S"))
    processed_power_df=pivoted_df.dropna()
    processed_power_df_list=processed_power_df.values.tolist()
    return processed_power_df_list