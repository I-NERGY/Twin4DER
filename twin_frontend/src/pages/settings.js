import React from "react";
import "./../styles/index.css";
import { Button, Form } from "react-bootstrap";
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
      textValue: '',
      dateSelection: [],
      minDate: undefined,
      maxDate: undefined,
      startDate: undefined,
      endDate: undefined,
      doWait: false,
    };
  }

  doInitialize = () => {
    this.setState({ doWait: true });

    axios.get('/connection/collections/initialize')
      .then(response => {
        this.setState({ textValue: 'Initialization successful!', doWait: false });
      })
      .catch(error => {
        this.setState({ textValue: 'Initialization failed, see console', doWait: false });
        console.error('There was a problem with the Axios request:', error);
      });
  };

  getSelectableDates = () => {
    this.setState({ doWait: true });

    axios.get('/connection/collections/power/selectable-dates')
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

    const path = '/connection/collections/power/dates/' + formatDate(this.state.startDate) + '/' + formatDate(this.state.endDate) + '/curated';
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

  render() {
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr', // Two equal columns
    };

    return (
      <div className="page-heading">
        <h1 className="title">Lorem ipsum</h1>
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
        <p>Info Box:</p>
        <div style={gridStyle}>
          <Form.Control type="text" value={this.state.textValue} readOnly />
          {this.state.doWait ?
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
        </div>
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
        <Button variant="primary" disabled={this.state.doWait} onClick={this.getRawData}>Get Raw Data</Button>
      </div>
    );
  }
}


/*
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-start">
            Start Date
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {this.state.dateSelection.map(one_date => (
              <Dropdown.Item>{one_date}</Dropdown.Item>
            ))}
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
*/

export default Settings;
