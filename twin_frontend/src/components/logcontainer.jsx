import { useSelector } from 'react-redux';
import "./../styles/index.css";

const LogContainer = () => {
  const status = useSelector((state) => state.status);

  return (
    <div className="log-container">
      <div className="log-messages">
        {status.logs.map((log, index) => (
          <div key={index} className="log-message">
            {log.date}: {log.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogContainer;