import { useSelector } from 'react-redux';
import "./../styles/index.css";

const ResultList = (props) => {
    const results = useSelector((state) => state.results);

    return (
      <table className="result-table">
        <tr>
          <th>Simulation run</th>
          <th> </th>
          <th> </th>
        </tr>
      {results.table_names.map((table_name, index) => (
        <tr key={index}>
          <td>
            <p>{table_name}</p>
          </td>
          <td>
            <button className="result-button" onClick={() => props.getColumns(table_name)}>load</button>
          </td>
          <td>
            <button className="result-button">show</button>
          </td>
        </tr>
      ))}
      </table>
    );
};

export default ResultList;