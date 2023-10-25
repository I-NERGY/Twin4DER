import React from "react";
import "./../styles/index.css";

class Insights extends React.Component {
  render() {
    return (
      <div className="page-heading">
        <h1 className="title">Grafana Dashboard</h1>
        <iframe src="http://localhost/grafana/dashboard-solo/new?utm_source=grafana_gettingstarted&orgId=1&tab=transform&from=1697082054413&to=1697103654414&panelId=1" width="450" height="200" frameborder="0"></iframe>
      </div>
    );
  }
}

export default Insights;