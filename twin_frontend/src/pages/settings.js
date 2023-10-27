import React from "react";
import "./../styles/index.css";
import { Button, Form, Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from 'axios';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      textValue: 'uninitialized',
      dateSelection: [],
      minDate: undefined,
      maxDate: undefined,
      startDate: undefined,
      endDate: undefined,
      doWait: false,
      startBGcolor: 'red',
      endBGcolor: 'lightblue'
    };
  }

  doInitialize = () => {
    this.setState({ doWait: true });

    axios.get('/api/connection/collections/initialize')
      .then(response => {
        this.setState({ textValue: response.data.message, doWait: false });
      })
      .catch(error => {
        this.setState({ textValue: 'Database Initialization failed, see console', doWait: false });
        console.error('There was a problem with the Axios request:', error);
      });
  };

  getSelectableDates = () => {
    this.setState({ doWait: true });

    axios.get('/api/connection/collections/power/selectable-dates')
      .then(response => {
        const datesAsArrayOfStrings = response.data["dates"];
        const dateObjects = datesAsArrayOfStrings.map(dateString => new Date(dateString));
        const minDate = new Date(Math.min(...dateObjects));
        const maxDate = new Date(Math.max(...dateObjects));

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
  isDateSelectable = (date) => {
    return this.state.dateSelection.some((selectableDate) =>
      selectableDate.toDateString() === date.toDateString()
    );
  };

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

  runDPsimStepwise = () => {
    this.setState({ doWait: true });

    axios.get('/api/simulation/dpsim/run/steps')
      .then(response => {
        this.setState({ textValue: response.data.message, doWait: false });
      })
      .catch(error => {
        this.setState({ textValue: 'Running DPsim step-wise failed, see console', doWait: false });
        console.error('There was a problem with the Axios request:', error);
      });
  };

  render() {
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr', // Two equal columns
    };

    return (
      <div className="page-heading">
        <h1 className="title">Simulation setup</h1>
        <p>Setup DPsim simulation</p>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Simulation status:
            </Form.Label>
            <Form.Control column type="text" value={this.state.textValue} readOnly sm="10"/>
            <Col sm="4">
            { this.state.doWait ?
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
          </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Control column type="button" value="Initialize" disabled={this.state.doWait} sm="3"/>

          </Form.Group>
    </Form>

        <Button variant="success" disabled={this.state.doWait} onClick={this.doInitialize}>Initialize</Button>
        <Button variant="primary" disabled={this.state.doWait} onClick={this.getSelectableDates}>Get Selectable Dates</Button>
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
        </Form>
      </div>
    );
  }
}

export default Settings;
