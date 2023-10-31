import psycopg2
import os
import pandas as pd
from sqlalchemy import create_engine

db_name = os.environ.get("DB_NAME")
db_user = os.environ.get("DB_USER")
db_password = os.environ.get("DB_PASSWORD")

#db_name = "somedb"
#db_user = "someusr"
#db_password = "somepwd"

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
    connection = psycopg2.connect(**db_params)
    cursor = connection.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    cursor.close()
    connection.close()
    return result

def connect_with_db():
    try:
        db_conn = psycopg2.connect(database=db_name,
                            host=db_host,
                            user=db_user,
                            password=db_password,
                            port=db_port)

        # Create a cursor to interact with the database
        db_cursor = db_conn.cursor()

        # Now you can execute SQL queries using the cursor
        db_cursor.execute("SELECT version();")

        # Fetch and print the result
        db_version = db_cursor.fetchone()
        print("PostgreSQL database version:", db_version)

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL:", error)


def create_table_from_csv():
    db_connection = "postgresql://" + db_user + ":" + db_password + "@" + db_host + "/" + db_name
    csv_file_path = "twin_api/test/result_dummy_data.csv"

    df = pd.read_csv(csv_file_path)
    engine = create_engine(db_connection)
    df.to_sql(db_name, engine, if_exists='replace', index=False)

def query_table():
    sql_query = "SELECT * FROM " + db_name
    rows = execute_query(sql_query)

    for row in rows:
        print(row)

def get_column_names():
    sql_query = f"SELECT column_name FROM information_schema.columns WHERE table_name = '{db_name}'"
    rows = execute_query(sql_query)

    column_names = [row[0] for row in rows]
    print("Column names:", column_names)


#query_table()
get_column_names()
