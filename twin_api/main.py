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

current_collection = None
power_collection = None
voltage_collection = None
db = None

@app.get('/connection/collections/initialize', tags=["initialize database"])
def connect_to_database():
   global current_collection, power_collection, voltage_collection
   global db
   response = JSONResponse(status_code=500, content={"message" : "Unknown internal server error."})

   ret, credentials=interface_db.read_credentials()
   if ret == 0:
      ret, db=interface_db.create_connection(credentials)
      if ret == 0:
         current_collection, power_collection, voltage_collection = interface_db.create_collections(db,credentials)
         response = JSONResponse(status_code=200, content={"message" : "The database connection was created and the collections are loaded."})
      else:
         response = JSONResponse(status_code=500, content={"message" : "Error: Failed to connect to database."})
   else:
      response = JSONResponse(status_code=403, content={"message" : "Error: Credentials file not accessible."})
   return response

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
   response = JSONResponse(status_code=500, content={"message" : "Unknown internal server error."})
   ret, error = interface_dpsim.read_mpc_file()

   if ret == 0:
      response = JSONResponse(status_code=200, content={"message" : "The electrical circuit is loaded."})
   else:
      response = JSONResponse(status_code=412, content={"message" : error})

   return response

@app.get('/simulation/dpsim/getdata/{initial_date}/{final_date}', tags=["retrieve simulation data"])
def retrieve_simulation_data(initial_date : datetime.date, final_date : datetime.date):
   global power_collection, start_date, end_date
   start_date = initial_date
   end_date = final_date

   response = JSONResponse(status_code=500, content={"message" : "Unknown internal server error."})
   try:
      interface_db.process_selected_timestamps(data_collection=power_collection,
                                                start_date_selection=initial_date.isoformat(),
                                                end_date_selection=final_date.isoformat())
      response = JSONResponse(status_code=200, content={"message" : "The simulation initial data retrieval is done.",
                                                        "power_collection" : power_collection})
   except NameError:
      response = JSONResponse(status_code=412,
                              content={"message" : "Error: power_collection is undefined."})
   return response

@app.get('/simulation/dpsim/configure', tags=["configure simulation"])
def configure_simulation_parameters():
   global result_file, start_date, end_date
   response = JSONResponse(status_code=500, content={"message" : "Unknown internal server error."})
   try:
      if start_date and end_date:
         result_file = interface_dpsim.dpsim_simulation_setup(start_date, end_date)
         response = JSONResponse(status_code=200,
                                 content={"message" : "The simulation setup is done.",
                                          "totalTimesteps" : len(interface_db.user_requested_timestamps)})
   except NameError:
      response = JSONResponse(status_code=412,
                              content={"message" : "Error: Simulation dates (start, end) are undefined."})
   return response

@app.get('/simulation/dpsim/run/steps', tags=["run step-wise simulation"])
def run_stepwise_simulation():
   global result_file
   response = JSONResponse(status_code=500, content={"message" : "Unknown internal server error."})
   try:
      if result_file:
         interface_dpsim.main_simulation_loop(result_file)
         response = JSONResponse(status_code=200, 
                                 content={"message" : "The simulation is running.",
                                          "filename": result_file,
                                          "totalTimesteps" : len(interface_db.user_requested_timestamps),
                                          "success" : True})
   except NameError:
      response = JSONResponse(status_code=412,
                              content={"message" : "Error: DPsim not correctly configured before running simulation."})
   return response

@app.get('/postgres/version', tags=["get postgres version"])
def connect_to_database():
   retVal, __ = interface_postgres.connect_postgres()
   if retVal == 0:
      return JSONResponse(status_code=200, content={"message" : "Connected to embedded Postgres database."})
   elif retVal == -1:
      return JSONResponse(status_code=401, content={"message" : "Connecting to postgres failed!"})
   else:
      return JSONResponse(status_code=500, content={"message" : "Connecting to postgres failed, unknown error!"})

@app.get('/postgres/tables', tags=["get postgres tables"])
def get_table_names():
   retVal, tables = interface_postgres.get_table_names()
   if retVal == 0:
      return JSONResponse(status_code=200, content={"message" : "Retrieved table names.", "tables": tables})
   else:
      return JSONResponse(status_code=500, content={"message" : "Getting table names failed, unknown error!"})
   
@app.get('/postgres/table/{nameOfDB}', tags=["get postgres table data"])
def get_table_data(nameOfDB: str = "numbers"):
   retVal, tables = interface_postgres.query_table(nameOfDB)
   if retVal == 0:
      return JSONResponse(status_code=200, content={"message" : "Retrieved table data.", "tables": tables})
   else:
      return JSONResponse(status_code=500, content={"message" : "Getting table data failed, unknown error!"})

@app.delete('/postgres/table/{nameOfDB}', tags=["delete postgres table"])
async def delete_table_data(nameOfDB: str):
   retVal = interface_postgres.delete_table(nameOfDB)
   if retVal == 0:
      return JSONResponse(status_code=200, content={"message" : "Successfully deleted table."})
   else:
      return JSONResponse(status_code=500, content={"message" : "Deletion of table failed!"})

@app.get('/postgres/columns/{nameOfDB}', tags=["get column names of table"])
def get_column_names(nameOfDB):
   retVal, columns = interface_postgres.query_column_names(nameOfDB)
   if retVal == 0:
      return JSONResponse(status_code=200, content={"message" : "Retrieved table columns.", "columns": columns})
   else:
      return JSONResponse(status_code=500, content={"message" : "Getting table columns failed, unknown error!"})

@app.get('/postgres/{nameOfTable}/{nameOfColumn}', tags=["get column of table"])
def get_column(nameOfTable, nameOfColumn):
   retVal, column = interface_postgres.query_table_column(nameOfTable, nameOfColumn)
   if retVal == 0:
      return JSONResponse(status_code=200, content={"message" : "Retrieved column from table.", "column": column, "columnName": nameOfColumn})
   else:
      return JSONResponse(status_code=500, content={"message" : "Getting column data failed, unknown error!"})
