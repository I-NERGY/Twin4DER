import { useSelector } from 'react-redux';
import "./../styles/index.css";

const ResultList = (props) => {
    //const results = useSelector((state) => state.results);

    return (
    <div className="horizontal-element">
      <table className="result-table">
        <tr>
          <th>{props.title}</th>
        </tr>
      {props.data.map((table_name, index) => (
        <tr key={index}>
          <td>
            <p>{table_name}</p>
          </td>
        </tr>
      ))}
      </table></div>
    );
};

/*
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
        <button className="result-button" onClick={() => props.deleteTable(table_name)}>delete</button>
      </td>
    </tr>
  ))}
  </table>
);
*/

export default ResultList;