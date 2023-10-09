# Minimal example server API
This server is based on Flask and interacts with the Database from the i-nergy project.

## How to run
Use the file provided `start_api.sh`

The server runs on port `31032` at the moment. 

### Endpoints

#### /connection/collections/initialize
Initializes the server connection. This must be called once at the beginning.

#### /connection/collections/power/selectable-dates
This provides the list of dates that the user can select.

#### /connection/collections/power/dates/<initial_date>/<final_date>
This retrieves the data (raw) from the `initial_date` to the `final_date`. The format is `yyyy-mm-dd`. 

#### /connection/collections/power/dates/<initial_date>/<final_date>/curated
A version without bad data of the previous endpoint.


### Example calls

Example: 

```
localhost:31032/connection/collections/initialize

localhost:31032/connection/collections/power/selectable-dates

localhost:31032/connection/collections/power/dates/2023-01-10/2023-01-10/curated

```