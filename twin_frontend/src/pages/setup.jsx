import "./../styles/index.css";
import LogContainer from '../components/logcontainer';
import DateSelector from '../components/dateselector';
import { useDispatch, useSelector } from 'react-redux';
import API from '../utilities/api';

function formatDate(datestr) {
  const date = new Date(datestr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Setup() {
  const dates = useSelector((state) => state.dates);
  const initialized = useSelector((state) => state.status.initialized);

  const api = new API();
  const dispatch = useDispatch();

  const doInitialize = () => {
    // initialize external DB which provides data input for our simulations
    api.executeGETrequest('/api/connection/collections/initialize').then(() => {

      // get the dates for which there is data which can be used in a simulation
      api.fetchData('/api/connection/collections/power/selectable-dates').then((response) => {
        dispatch({ type: 'ADD_DATES', payload: response.data['dates'] })
      });
    })

    api.executeGETrequest('/api/simulation/dpsim/initialize');
    api.executeGETrequest('/api/postgres/version');
    //dispatch({ type: 'INITIALIZE' });
  };

  const runDPsimStepwise = () => {
    const requestSimulationData = '/api/simulation/dpsim/getdata/' + formatDate(dates.selectedStart) + '/' + formatDate(dates.selectedEnd);

    api.executeGETrequest(requestSimulationData).then(() => {
      api.executeGETrequest('/api/simulation/dpsim/configure').then(() => {
        api.executeGETrequest('/api/simulation/dpsim/run/steps');
      });
    });

  };

  return (
    <div className="page-heading">
      <h1 className="title">Simulation setup</h1>
      <p>Setup DPsim simulation</p>
      <div className='settings-container'>
        <div className='settings-controls'>
          <button className='twin-btn' onClick={doInitialize} disabled={initialized}>Initialize</button>
          {false ?
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
          <p>Input timeframe for simulation:</p>
          <DateSelector />
          <button className='twin-btn' onClick={runDPsimStepwise}> Run simulation </button>
        </div>
        <LogContainer />
      </div>
    </div>
  );
};

export default Setup;