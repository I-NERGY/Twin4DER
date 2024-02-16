import React, { useEffect, useState } from "react";
import "./../styles/index.css";
import useAPI from '../utilities/api';
import { useDispatch, useSelector } from 'react-redux';
import ResultChart from "../components/resultchart";
import ClickableItemList from "../components/clickableitemlist";


function Insights() {
  const dispatch = useDispatch();
  const results = useSelector((state) => state.results);
  const { fetchData, deleteData } = useAPI();
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    getResultTableNames();
  }, []);

  const getResultTableNames = () => {
    fetchData('/api/postgres/tables').then((response) => {
      dispatch({ type: 'SET_TABLE_NAMES', payload: response.data['tables'] });
    });
  }

  const getColumns = (tableName) => {
    dispatch({ type: 'RESET_COLUMN_DATA' });

    fetchData('/api/postgres/columns/' + tableName).then((response) => {
      dispatch({ type: 'SET_COLUMNS', payload: response.data['columns'] });
    });}
  
  // delete table and fetch all table names again
  const deleteTable = (tableName) => {
    deleteData('/api/postgres/table/' + tableName).then(() => {
        getResultTableNames();
  });}

  const onSimulationrunSelection = (tableName) => {
    setSelectedTable(tableName);
    // get the columns of the selected table as well as the data of the time column
    getColumns(tableName);
    fetchData('/api/postgres/' + tableName + '/' + '          time').then((response) => {
      dispatch({ type: 'SET_TIMES', payload: response.data['column'] });
    });
  }

  const onColumnSelection = (columnName) => {
    console.log(columnName)

    fetchData('/api/postgres/' + selectedTable + '/' + columnName).then((response) => {
      dispatch({ type: 'ADD_COLUMN_DATA', columnData: response.data['column'], columnName: response.data['columnName'] });
    });
  }

  const getColumnData = (tableName, columnName, actionType, dataType) => {
    fetchData('/api/postgres/' + tableName + '/' + columnName, actionType, dataType).then((response) => {
      dispatch({ type: actionType, payload: response.data[dataType] });
    });}

  const handleColumnClick = (columnName) => {
    const isColumnSelected = selectedColumns.includes(columnName);
    if (isColumnSelected) {
      setSelectedColumns(selectedColumns.filter((item) => item !== columnName));
      dispatch({ type: 'REMOVE_COLUMN_DATA', columnName: columnName });
    } else {
      setSelectedColumns([...selectedColumns, columnName]);
      fetchData('/api/postgres/' + selectedTable + '/' + columnName).then((response) => {
        dispatch({ type: 'ADD_COLUMN_DATA', columnData: response.data['column'], columnName: response.data['columnName'] });
      });
    }
  }

  return (
      <div className="page-heading">
        <h1 className="title">Simulation Results </h1>
        <div className="horizontal-container">
        <ClickableItemList title="Simulation runs" data={results.table_names} onSelection={onSimulationrunSelection} selectedItems={selectedTable}/>
        <ClickableItemList title="Results" data={results.columns} onSelection={handleColumnClick} selectedItems={selectedColumns}/>
        {
          results.dataColumns.length > 0 && results.times.length > 0 ? 
          <ResultChart x={results.times} y={results.dataColumns}/> 
          : null
        }
        </div>

      </div>
    );

}

export default Insights;