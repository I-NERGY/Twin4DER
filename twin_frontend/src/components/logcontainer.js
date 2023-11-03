import React, { useState } from 'react';
import "./../styles/index.css";


const LogContainer = (props) => {
  //const [logs, setLogs] = useState([]);
  const { logs } = props;

/*
  const addLog = (message) => {
    setLogs([...logs, message]);
  };
*/
  return (
    <div className="log-container">
      <div className="log-messages">
        {logs.map((log, index) => (
          <div key={index} className="log-message">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogContainer;