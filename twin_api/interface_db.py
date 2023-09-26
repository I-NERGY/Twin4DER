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