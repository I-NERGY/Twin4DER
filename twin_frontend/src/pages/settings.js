import React, { useState } from 'react';
import "./../styles/index.css";
import LogContainer from '../components/logcontainer';
import DateSelector from '../components/dateselector';
import { useDispatch } from 'react-redux';

import axios from 'axios';


function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// TODO: make "initialized" application-wide state

function Settings() {
  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);
  const [doWait, setWaiting] = useState(false);


  const addLog = (message) => {
    dispatch({ type: 'ADD_LOG', payload: message });
  };

  const changeWaiting = (wait) => {
    setWaiting(wait);
  };

  const executeGETrequest = (url) => {
    axios.get(url)
      .then(response => {
        addLog(response.data.message);
      })
      .catch(error => {
        addLog(error.message);
      });
  }

  const getSelectableDates = () => {
    axios.get('/api/connection/collections/power/selectable-dates')
      .then(response => {
        addLog(response.data.message);
        const datesAsArrayOfStrings = response.data["dates"];
        dispatch({ type: 'ADD_DATES', payload: datesAsArrayOfStrings });
      })
      .catch(error => {
        addLog(error.message);
      });
  };

  const doInitialize = () => {
    changeWaiting(true);

    // initialize external DB which provides data input for our simulations
    executeGETrequest('/api/connection/collections/initialize');

    // get the dates for which there is data which can be used in a simulation
    getSelectableDates();

    // initialize DPsim
    executeGETrequest('/api/simulation/dpsim/initialize');

    changeWaiting(false);
  }

  const prepareSimulation = () => {
    // .... TODO
        
    // configure DPsim
    executeGETrequest('/api/simulation/dpsim/configure');
  }

  const runDPsimStepwise = () => {

    axios.get('/api/simulation/dpsim/run/steps')
      .then(response => {
        //this.setState({ textValue: response.data.message, doWait: false });
      })
      .catch(error => {
        //this.setState({ textValue: 'Running DPsim step-wise failed, see console', doWait: false });
        console.error('There was a problem with the Axios request:', error);
      });
  };

  return (
    <div className="page-heading">
      <h1 className="title">Simulation setup</h1>
      <p>Setup DPsim simulation</p>
      <div className='settings-container'>
        <div className='settings-controls'>
          <button className='twin-btn' onClick={doInitialize} disabled={doWait}>Initialize</button>
          {doWait ?
            <img
              style={{ height: 80 }}
              src='/images/ajax-loader.gif'
              alt="Please wait.."
            />
            :
            <img
              style={{ height: 80 }}
              src='/images/logo.png'
              alt="I-NERGY Logo"
            />
          }
          <DateSelector/>
          <button className='twin-btn' onClick={prepareSimulation} disabled={doWait}>Set timeframe for simulation</button>
          <button className='twin-btn' onClick={runDPsimStepwise} disabled={doWait}>Run simulation</button>
        </div>
        <LogContainer/>
      </div>
    </div>
  );
};

export default Settings;

/*

  getRawData = () => {
    this.setState({ doWait: true });

    const path = '/api/connection/collections/power/dates/' + formatDate(this.state.startDate) + '/' + formatDate(this.state.endDate) + '/curated';
    console.log(path);
    axios.get(path)
      .then(response => {
        this.setState({ textValue: 'Received raw data, see console!', doWait: false });
        console.log(response);
      })
      .catch(error => {
        this.setState({ textValue: 'Receiving raw data failed, see console', doWait: false });
        console.error('There was a problem with the Axios request:', error);
      });
  };


  getSimulationData = () => {
    this.setState({ doWait: true });

    const path = '/api/simulation/dpsim/getdata/' + formatDate(this.state.startDate) + '/' + formatDate(this.state.endDate);
    console.log(path);
    axios.get(path)
      .then(response => {
        this.setState({ textValue: response.data.message, doWait: false });
        console.log(response);
      })
      .catch(error => {
        this.setState({ textValue: 'Receiving simulation data failed, see console', doWait: false });
        console.error('There was a problem with the Axios request:', error);
      });
  };

  doConfigureDPsim = () => {
    this.setState({ doWait: true });

    axios.get('/api/simulation/dpsim/configure')
      .then(response => {
        this.setState({ textValue: response.data.message, doWait: false });
      })
      .catch(error => {
        this.setState({ textValue: 'Configuration of DPsim failed, see console', doWait: false });
        console.error('There was a problem with the Axios request:', error);
      });
  };



  connectPostgres = () => {
    this.setState({ doWait: true });

    axios.get('/api/postgres/version')
      .then(response => {
        this.setState({ textValue: response.data.message, doWait: false });
      })
      .catch(error => {
        this.setState({ textValue: error.message, doWait: false });
        console.error('There was a problem with the Axios request:', error);
      });
  };
}

//<Form.Control column type="text" value={this.state.textValue} readOnly sm="10"/>
*/