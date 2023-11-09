import React, {useEffect} from "react";
import "./../styles/index.css";
import ResultList from "../components/resultlist";
import API from '../utilities/api';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from "../components/dropdown";


function Insights() {
  const api = new API();
  const dispatch = useDispatch();
  const columns = useSelector((state) => state.results.columns);


  useEffect(() => {
    getResultTableNames();
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
        <ResultList getColumns={getColumns} deleteTable={deleteTable}/>
        <Dropdown options={columns} title="Select column"/>
        <button onClick={getColumnData}>Get column data</button>
      </div>
    );

}

export default Insights;
