import React, {useEffect} from "react";
import "./../styles/index.css";
import ResultList from "../components/resultlist";
import API from '../utilities/api';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from "../components/dropdown";
import ResultChart from "../components/resultchart";


function Insights() {
  const api = new API();
  const dispatch = useDispatch();
  const columns = useSelector((state) => state.results.columns);
  const results = useSelector((state) => state.results);



  useEffect(() => {
    getResultTableNames();

    let tableName = "_2022_10_21__2022_10_22";
    let columnName = '       N1.V.re';
    let actionType = "SET_COLUMN_DATA";
    let dataType = "column";

    getColumns(tableName);
    getColumnData(tableName, columnName, actionType, dataType);
    getColumnData(tableName, '          time', 'SET_TIMES', dataType);

  }, []);

  const getResultTableNames = () => {
    api.fetchData('/api/postgres/tables', 'SET_TABLE_NAMES', 'tables').then((actions) => {
      actions.forEach((action) => {
        dispatch(action);
      });
    });
  }

  const getColumns = (tableName) => {
    api.fetchData('/api/postgres/columns/' + tableName, 'SET_COLUMNS', 'columns').then((actions) => {
      actions.forEach((action) => {
        dispatch(action);
      });
    });}
  
  // delete table and fetch all table names again
  const deleteTable = (tableName) => {
    api.delete('/api/postgres/table/' + tableName).then((action) => {
        dispatch(action);
        getResultTableNames();
  });}

  const getColumnData = (tableName, columnName, actionType, dataType) => {
    api.fetchData('/api/postgres/' + tableName + '/' + columnName, actionType, dataType).then((actions) => {
      actions.forEach((action) => {
        dispatch(action);
      });
    });}

  return (
      <div className="page-heading">
        <h1 className="title">Simulation Results </h1>
        <div className="horizontal-container">
        <ResultList title="Simulation runs" data={results.table_names}/>
        <ResultList title="Results" data={results.columns}/>
        <ResultChart a={results.times} b={results.dataOfSelectedColumn}/>
        </div>

      </div>
    );

}

//<ResultList getColumns={getColumns} deleteTable={deleteTable}/>


export default Insights;
