from flask import Flask, Response
from flask import jsonify
from bson.json_util import dumps, loads
app = Flask(__name__)

import interface_db

global db
global current_collection, power_collection, voltage_collection

@app.route('/connection/collections/initialize')
def connect_db():
   global current_collection, power_collection, voltage_collection
   global db
   credentials=interface_db.read_credentials()
   db=interface_db.create_connection(credentials)
   current_collection, power_collection, voltage_collection = interface_db.create_collections(db,credentials)
   return jsonify(message="The database connection was created and the collections are loaded.", success=True)

@app.route('/connection/collections/current/csv')
def get_csv_current():
   global current_collection
   if interface_db.create_csv_current(current_collection) == True:
      return jsonify(message="The csv file was created.", success=True)
   else:
      return jsonify(message="The csv file was not created.", success=False)
   
@app.route('/connection/collections/power/selectable-dates')
def get_selectable_dates_power():
   global power_collection
   response=jsonify(
      dates=interface_db.get_selectable_dates(power_collection),
      success=True
   )
   return response

@app.route('/connection/collections/power/dates/<initial_date>/<final_date>')
def get_power_selected_dates(initial_date, final_date):
   global power_collection
   info_dates={'begin' : initial_date, 'end' : final_date, 'success' : True}
   result_list=interface_db.get_data_between_dates(power_collection,initial_date,final_date)
   result_json=dumps(result_list, indent = 2)
   response = Response(
      response=result_json, 
      status=200,
      mimetype='application/json',
      headers=info_dates
   )
   return response