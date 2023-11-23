import requests
import pytest

BASE_URL = 'http://localhost:5050'

@pytest.fixture
def init_fixture():
    api_url = '/simulation/dpsim/initialize'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 200

def test_run_steps_without_preconditions():
    api_url = '/simulation/dpsim/run/steps'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 412

def test_configure_without_preconditions():
    api_url = '/simulation/dpsim/configure'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 412

#def test_initialize():
#    api_url = '/simulation/dpsim/initialize'
#    response = requests.get(BASE_URL + api_url)
#    assert response.status_code == 200

#def test_run_stepwise(init_fixture):
#    start_date = '2022-10-21'
#    end_date = '2022-10-22'
#    api_url = '/simulation/dpsim/getdata/' + start_date + '/' + end_date
#    mocked_db_results = "Mocked DB results"
#    with patch('interface_db.process_selected_timestamps', return_value=mocked_db_results) as mock_process_selected_timestamps:
#        response = requests.get(BASE_URL + api_url)
#        assert response.status_code == 200
#        assert response.json() == mocked_db_results
#        mock_process_selected_timestamps.assert_called_once_with(mock.ANY, start_date, end_date)