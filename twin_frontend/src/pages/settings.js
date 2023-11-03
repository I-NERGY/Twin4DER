import React, { useState } from 'react';
import "./../styles/index.css";
import LogContainer from '../components/logcontainer';
import DateSelector from '../components/dateselector';
import { useDispatch } from 'react-redux';

import axios from 'axios';

const MINDATE = "2022-10-21";
const MAXDATE = "2022-10-22";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}



// TODO: make "initialized" application-wide state
// log messages also have to go into application state

function Settings() {
  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);
  const [doWait, setWaiting] = useState(false);
  const [logs, setLogs] = useState([]);


  const addLog = (message) => {
    setLogs([...logs, message]);
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
        const dateObjects = datesAsArrayOfStrings.map(dateString => new Date(dateString));
        dispatch({ type: 'ADD_DATES', payload: dateObjects });
      })
      .catch(error => {
        addLog(error.message);
      });
  };


  const doInitialize = () => {
    changeWaiting(true);

    // initialize external DB which provides data input for our simulations
    executeGETrequest('/api/connection/collections/initialize');
    getSelectableDates();


    changeWaiting(false);
  }

  const runDPsimStepwise = () => {
    //his.setState({ doWait: true });

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
          <DateSelector selectableDates={selectableDates} />
          <button className='twin-btn' onClick={runDPsimStepwise} disabled={doWait}>Run simulation</button>
        </div>
        <LogContainer logs={logs} />
      </div>
    </div>
  );
};

export default Settings;

/*

  getSelectableDates = () => {
    this.setState({ doWait: true });

    axios.get('/api/connection/collections/power/selectable-dates')
      .then(response => {
        const datesAsArrayOfStrings = response.data["dates"];
        const dateObjects = datesAsArrayOfStrings.map(dateString => new Date(dateString));
        //const minDate = new Date(Math.min(...dateObjects));
        //const maxDate = new Date(Math.max(...dateObjects));

        const minDate = new Date(MINDATE);
        const maxDate = new Date(MAXDATE);

        this.setState({
          textValue: 'Got selectable dates!',
          dateSelection: dateObjects,
          startDate: minDate,
          endDate: maxDate,
          minDate: minDate,
          maxDate: maxDate,
          doWait: false
        });
      })
      .catch(error => {
        this.setState({ textValue: 'Getting selectable dates failed, see console', doWait: false });
        console.error('There was a problem with the Axios request:', error);
      });
  };

  // check if the date is in the dateSelection array


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

  doInitializeDPsim = () => {
    this.setState({ doWait: true });

    axios.get('/api/simulation/dpsim/initialize')
      .then(response => {
        this.setState({ textValue: 'Initialization of DPsim successful!', doWait: false });
      })
      .catch(error => {
        this.setState({ textValue: 'Initialization failed, see console', doWait: false });
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

SelectableDates}>Get Selectable Dates</Button>
        <Form>
          <Form.Text muted>Start Date:</Form.Text>
          <DatePicker
            selected={this.state.startDate}
            minDate={this.state.minDate}
            maxDate={this.state.maxDate}
            filterDate={(date) => this.isDateSelectable(date)}
            onChange={(date) => this.setState({ startDate: date })}
          />
        </Form>
        <Form>
          <Form.Text muted>End Date:</Form.Text>
          <DatePicker
            selected={this.state.endDate}
            minDate={this.state.startDate}
            maxDate={this.state.maxDate}
            filterDate={(date) => this.isDateSelectable(date)}
            onChange={(date) => this.setState({ endDate: date })}
          />
        </Form>
        <Form>
          <Button variant="primary" disabled={this.state.doWait} onClick={this.getRawData}>Get Raw Data</Button>
          <Button variant="success" disabled={this.state.doWait} onClick={this.doInitializeDPsim}>Init DPsim</Button>
          <Button variant="success" disabled={this.state.doWait} onClick={this.getSimulationData}>Get Simulation Data</Button>
          <Button variant="success" disabled={this.state.doWait} onClick={this.doConfigureDPsim}>Configure DPsim</Button>
          <Button variant="success" disabled={this.state.doWait} onClick={this.runDPsimStepwise}>Run DPsim stepwise</Button>
          <Button variant="success" disabled={this.state.doWait} onClick={this.connectPostgres}>Connect Postgres</Button>
        </Form>
      </div>
    );
  }
}

export default Settings;
