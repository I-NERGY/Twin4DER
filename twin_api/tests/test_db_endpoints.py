import requests
import pytest

BASE_URL = 'http://localhost:5050'

@pytest.fixture
def init_db_fixture():
    api_url = '/connection/collections/initialize'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 200

def test_initialize_db_no_credentials():
    api_url = '/connection/collections/initialize'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 403

def test_initialize_db_wrong_connection_data():
    api_url = '/connection/collections/initialize'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 403
