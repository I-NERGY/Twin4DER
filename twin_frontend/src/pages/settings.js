import React from "react";
import "./../styles/index.css";
import { Button, Form } from "react-bootstrap";

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      textValue: '',
    };
  }

  doInitialize = () => {
    // Update the textValue in state when the button is clicked
    this.setState({ textValue: 'New Text Content' });
  };

  render() {
    const buttonStyle = {

    }

    return (
      <div className="page-heading">
        <h1 className="title">Lorem ipsum</h1>
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
        <Button className="custom" onClick={this.doInitialize}>Initialize</Button>
        <Form.Control type="text" value={this.state.textValue} readOnly />
      </div>
    );
  }
}

export default Settings;
