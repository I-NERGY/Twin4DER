from flask import Flask
from flask import jsonify
app = Flask(__name__)

import interface_db

global db
global current_collection, power_collection, voltage_collection

@app.route('/connection/collections')
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