import psycopg2
import os

global db_name, db_user, db_password

db_name = os.environ.get("POSTGRES_DB")
db_user = os.environ.get("POSTGRES_USER")
db_password = os.environ.get("POSTGRES_PASSWORD")

db_host = "postgres"
db_port = "5432"

def connect_postgres():
    try:
        conn = psycopg2.connect(database=db_name,
                        host=db_host,
                        user=db_user,
                        password=db_password,
                        port=db_port)
    
        # Create a cursor to interact with the database
        cursor = conn.cursor()

        # Now you can execute SQL queries using the cursor
        cursor.execute("SELECT version();")

        # Fetch and print the result
        db_version = cursor.fetchone()
        print("PostgreSQL database version:", db_version)

        return 0, db_version
    
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL:", error)
        return -1, error
