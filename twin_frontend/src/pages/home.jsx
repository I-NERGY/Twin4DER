import React from "react";

import "./../styles/index.css";
class Home extends React.Component {
  render() {
    return (
      <div className="page-heading">
        <h1 className="title">Digital Twin for Distributed Energy Markets (DER)</h1>
        <p>This Digital Twin (DT) for power systems containing Distributed Energy Resources (DER) 
        enables running power system simulations and evaluate system level scenarios, 
        as well as interfacing with applications that produce forecasting using AI models.
        The simulations are performed with the open-source real-time simulator DPsim.
        The underlying power system models of the DT are based on real world networks from the pilots within the I-NERGY project.
        </p>
      </div>
    );
  }
}

export default Home;
