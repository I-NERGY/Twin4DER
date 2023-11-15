import requests

BASE_URL = 'http://localhost:5050'

def test_dummy_endpoint():
    api_url = '/postgres/dummy'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 200

def test_version_endpoint():
    api_url = '/postgres/version'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 401