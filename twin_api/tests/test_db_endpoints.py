import requests
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
import sys
import os

cwd = os.getcwd()
apidir = os.path.join(cwd, 'twin_api/api')
sys.path.append(apidir)

from main import app, connect_to_database

BASE_URL = 'http://localhost:5050'

@pytest.fixture
def init_db_fixture():
    api_url = '/connection/collections/initialize'
    response = requests.get(BASE_URL + api_url)
    assert response.status_code == 200

def test_initialize_db_no_credentials():
    with TestClient(app) as client:
        with patch('interface_db.read_credentials') as mock_readcredentials:
            mock_readcredentials.return_value = -1, None
            response = client.get(BASE_URL + "/connection/collections/initialize")
        
    assert response.status_code == 403
    mock_readcredentials.assert_called_once_with()

def test_initialize_db_no_connection():
    mock_credentials = {
    "pymongo_url": "0.1.0.1",
    "pymongo_port": 50
    }

    with TestClient(app) as client:
        with patch('interface_db.read_credentials') as mock_readcredentials:
            mock_readcredentials.return_value = 0, mock_credentials
            with patch('interface_db.create_connection') as mock_createconn:
                mock_createconn.return_value = -1, None
                response = client.get(BASE_URL + "/connection/collections/initialize", params=mock_credentials)
        
    assert response.status_code == 500
    mock_readcredentials.assert_called_once_with()
    mock_createconn.assert_called_once_with(mock_credentials)

def test_initialize_fail_collections():
    mock_credentials = {
    "pymongo_url": "0.1.0.1",
    "pymongo_port": 50
    }

    with TestClient(app) as client:
        with patch('interface_db.read_credentials') as mock_readcredentials:
            mock_readcredentials.return_value = 0, mock_credentials
            with patch('interface_db.create_connection') as mock_createconn:
                mock_createconn.return_value = 0, None
                response = client.get(BASE_URL + "/connection/collections/initialize", params=mock_credentials)
        
    assert response.status_code == 500
    content = response.json()
    expected_message = "Creation of collections failed after DB connection."
    assert content["message"] == expected_message
    mock_readcredentials.assert_called_once_with()
    mock_createconn.assert_called_once_with(mock_credentials)

def test_initialize_success():
    mock_credentials = {
    "pymongo_url": "0.1.0.1",
    "pymongo_port": 50
    }

    with TestClient(app) as client:
        with patch('interface_db.read_credentials') as mock_readcredentials:
            mock_readcredentials.return_value = 0, mock_credentials
            with patch('interface_db.create_connection') as mock_createconn:
                mock_createconn.return_value = 0, None
                with patch('interface_db.create_collections') as mock_createcoll:
                    mock_createcoll.return_value = [0, 0, 0, 0]
                    response = client.get(BASE_URL + "/connection/collections/initialize", params=mock_credentials)
        
    assert response.status_code == 200
    mock_readcredentials.assert_called_once_with()
    mock_createconn.assert_called_once_with(mock_credentials)
    mock_createcoll.assert_called_once_with(None, mock_credentials)

def tod0_test_get_selectable_dates_no_credentials():
    # ensure that selectable dates endpoint returns error code
    # if the initialization failed beforehand
    pass
