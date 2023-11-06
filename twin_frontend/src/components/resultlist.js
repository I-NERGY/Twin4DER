import { useSelector } from 'react-redux';
import "./../styles/index.css";

const ResultList = () => {
    const results = useSelector((state) => state.results);

    return (
      <table className="result-table">
      {results.table_names.map((result, index) => (
        <tr key={index}>
          <td>
            <button className="result-button">{result}</button>
          </td>
        </tr>
      ))}
      </table>
    );
};

export default ResultList;