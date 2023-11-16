import requests

BASE_URL = 'http://localhost:5050'

def test_run_steps_without_preconditions():
    api_url = '/simulation/dpsim/run/steps'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 412

def test_configure_without_preconditions():
    api_url = '/simulation/dpsim/configure'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 412

def test_initialize():
    api_url = '/simulation/dpsim/initialize'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 200
