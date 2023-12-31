#import pymongo
#from bson.json_util import dumps, loads

user_requested_timestamps = None

def read_credentials():
    import json
    ret = 0
    credentials = None
    try:
        with open('../../credentials/credentials.json', 'r') as openfile:
            # Reading from json file
            credentials = json.load(openfile)
    except FileNotFoundError:
        ret = -1
    return ret, credentials

def create_connection(credentials):
    from pymongo import MongoClient
    ret = 0
    db = MongoClient(credentials['pymongo_url'], 
                    credentials['pymongo_port'], 
                     username=credentials['pymongo_username'],
                     password=credentials['pymongo_password']).get_database(credentials['pymongo_database_name'])
    try:
        # check connection status. The ismaster command is cheap.
        db.command('ismaster')
    except Exception:
        ret = -2
    return ret, db

def create_collections(db, credentials):
    try:
        current_collection = eval(credentials['meter_current_name'])
        power_collection = eval(credentials['meter_power_name'])
        voltage_collection = eval(credentials['meter_voltage_name'])
    except KeyError:
        return [ -3, 0, 0, 0 ]

    return [ 0, current_collection, power_collection, voltage_collection ]

def create_csv_current(current_collection):
    import pandas as pd
    current_df = pd.DataFrame(current_collection.find())
    current_df.to_csv('current_new.csv')
    return True

def get_selectable_dates(data_collection):
    import datetime
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
    processed_power_df=process_query_power_data_raw(user_query_result)
    processed_power_df_list=processed_power_df.values.tolist()
    return processed_power_df_list

def process_query_power_data_raw(user_query_result):
    import pandas as pd
    import datetime

    global processed_power_df
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
    return processed_power_df

def process_selected_timestamps(data_collection,start_date_selection,end_date_selection):
    global user_requested_timestamps
    user_query_result= get_data_between_dates_raw(data_collection,start_date_selection,end_date_selection)
    processed_power_df = process_query_power_data_raw(user_query_result)
    user_requested_timestamps=generate_timestamps(start_date_selection,end_date_selection)
    return processed_power_df

def generate_timestamps(start_date_selection,end_date_selection):
    import pandas as pd

    global user_requested_timestamps
    user_requested_timestamps= pd.date_range(start_date_selection, end_date_selection, freq='5Min').tolist()
    return user_requested_timestamps