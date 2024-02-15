import psycopg2
import os
import pandas as pd
from sqlalchemy import create_engine

global db_name, db_user, db_password

db_name = os.environ.get("POSTGRES_DB")
db_user = os.environ.get("POSTGRES_USER")
db_password = os.environ.get("POSTGRES_PASSWORD")
db_host = os.environ.get("POSTGRES_HOST")

db_port = "5432"

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
        return 0, result
    except (Exception, psycopg2.Error) as error:
        print(error)
        return -1, error    

def connect_postgres():
    return execute_query("SELECT version();")

def create_table_from_csv(csv_file_path):
    new_db_name = ""
    index = csv_file_path.rfind("/")
    if index != -1:
        new_db_name = csv_file_path[index + 1:]
    else:
        new_db_name = csv_file_path
    new_db_name = os.path.splitext(new_db_name)[0]

    create_table_query = 'CREATE TABLE IF NOT EXISTS ' + new_db_name
    execute_query(create_table_query)

    db_connection = "postgresql://" + db_user + ":" + db_password + "@" + db_host + "/" + db_name
    df = pd.read_csv(csv_file_path)
    engine = create_engine(db_connection)
    df.to_sql(new_db_name, engine, if_exists='replace', index=False)

def get_table_names():
    sql_query = f"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    ret, rows = execute_query(sql_query)
    table_names = [row[0] for row in rows]
    # remove whitespace from table names
    table_names = [table_name.strip() for table_name in table_names]
    return ret, table_names

def query_column_names(nameOfDB):
    sql_query = f"SELECT column_name FROM information_schema.columns WHERE table_name = '{nameOfDB}'"
    ret, rows = execute_query(sql_query)
    column_names = [row[0] for row in rows]
    # remove whitespace from column names
    #column_names = [column_name.strip() for column_name in column_names]
    return ret, column_names

def query_table(nameOfDB):
    sql_query = "SELECT * FROM " + nameOfDB
    ret, rows = execute_query(sql_query)

def delete_table(nameOfDB):
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()
        cursor.execute("DROP TABLE " + nameOfDB)
        cursor.execute("COMMIT")
        cursor.close()
        connection.close()
        return 0
    except (Exception, psycopg2.Error) as error:
        return -1

def query_table_column(table_name, column_name):
    sql_query = 'SELECT "' + column_name + '" FROM ' + table_name
    ret, results = execute_query(sql_query)
    column_data = [row[0] for row in results]
    return ret, column_data