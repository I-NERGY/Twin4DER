FROM postgres:16.0

# Copy the initialization script into the container
COPY init.sh /docker-entrypoint-initdb.d/

COPY create_fixtures.sql /docker-entrypoint-initdb.d/create_fixtures.sql