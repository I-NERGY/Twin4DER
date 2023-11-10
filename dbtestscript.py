import psycopg2
import os
import pandas as pd
from sqlalchemy import create_engine

#db_name = os.environ.get("DB_NAME")
#db_user = os.environ.get("DB_USER")
#db_password = os.environ.get("DB_PASSWORD")

db_name = "somedb"
db_user = "someusr"
db_password = "somepwd"

db_host = "localhost"
db_port = "5432"

db_conn = None
db_cursor = None

db_params = {
    "host": db_host,
    "database": db_name,
    "user": db_user,
    "password": db_password
}

def execute_query(sql):
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        cursor.close()
        connection.close()
        return result
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return error

def get_version():
    db_version = execute_query("SELECT version();")
    print("PostgreSQL database version:", db_version)

def create_table_from_csv(nameOfTable):
    # create table 'nameOfDB'
    create_table_query = 'CREATE TABLE IF NOT EXISTS ' + nameOfTable
    db_connection = "postgresql://" + db_user + ":" + db_password + "@" + db_host + "/" + db_name
    csv_file_path = "twin_api/test/dummy_result_data.csv"

    df = pd.read_csv(csv_file_path)
    engine = create_engine(db_connection)
    df.to_sql(nameOfTable, engine, if_exists='replace', index=False)

def query_table(nameOfDB):
    sql_query = "SELECT * FROM " + nameOfDB
    rows = execute_query(sql_query)

    for row in rows:
        print(row)

def get_column_names(nameOfDB):
    sql_query = f"SELECT column_name FROM information_schema.columns WHERE table_name = '{nameOfDB}'"
    rows = execute_query(sql_query)
    print(rows)

    column_names = [row[0] for row in rows]
    # remove whitespace from column names
    column_names = [column_name.strip() for column_name in column_names]
    print("Column names:", column_names)

def get_table_names():
    sql_query = f"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    rows = execute_query(sql_query)

    table_names = [row[0] for row in rows]
    # remove whitespace from table names
    table_names = [table_name.strip() for table_name in table_names]
    print("Table names:", table_names)

def delete_table(nameOfDB):
    sql_query = "DROP TABLE " + nameOfDB
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()
        cursor.execute(sql_query)
        # refresh the database
        cursor.execute("COMMIT")
        cursor.close()
        connection.close()
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)

def query_table_column(table_name, column_name):
    sql_query = 'SELECT "' + column_name + '" FROM ' + table_name
    column_data = execute_query(sql_query)
    print(column_data)

#dbName = "test2"
#create_table_from_csv(dbName)
#query_table()
get_column_names("_2022_10_21__2022_10_22")
#get_version()

#get_table_names()

#delete_table("test1")
#get_table_names()

query_table_column("_2022_10_21__2022_10_22", '       N1.V.re')
#query_table("_2022_10_21__2022_10_22")
