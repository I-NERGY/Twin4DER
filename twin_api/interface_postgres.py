import psycopg2
import os
import pandas as pd
from sqlalchemy import create_engine

global db_name, db_user, db_password

db_name = os.environ.get("POSTGRES_DB")
db_user = os.environ.get("POSTGRES_USER")
db_password = os.environ.get("POSTGRES_PASSWORD")

db_host = "postgres"
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
        return -1, error    

def connect_postgres():
    return execute_query("SELECT version();")

def create_table_from_csv(csv_file_path):
    db_connection = "postgresql://" + db_user + ":" + db_password + "@" + db_host + "/" + db_name
    df = pd.read_csv(csv_file_path)
    engine = create_engine(db_connection)
    df.to_sql(db_name, engine, if_exists='replace', index=False)

def get_table_names():
    sql_query = f"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    ret, rows = execute_query(sql_query)
    table_names = [row[0] for row in rows]
    # remove whitespace from table names
    table_names = [table_name.strip() for table_name in table_names]
    return ret, table_names

    

