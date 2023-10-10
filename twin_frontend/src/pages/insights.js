import React from "react";
import "./../styles/index.css";

class Insights extends React.Component {
  render() {
    return (
      <div className="page-heading">
        <h1 className="title">Simulation Results</h1>
        <iframe src="https://villas.k8s.eonerc.rwth-aachen.de/" title="VILLASweb" height="600" width="1200" ></iframe> 
      </div>
    );
  }
}

export default Insights;
