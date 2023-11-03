import { useSelector } from 'react-redux';
import "./../styles/index.css";

const LogContainer = () => {
  const logs = useSelector((state) => state.logs);

  return (
    <div className="log-container">
      <div className="log-messages">
        {logs.logs.map((log, index) => (
          <div key={index} className="log-message">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogContainer;