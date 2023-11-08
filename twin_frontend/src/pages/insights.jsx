import React from "react";
import "./../styles/index.css";
import ResultList from "../components/resultlist";
import API from '../utilities/api';
import { useDispatch } from 'react-redux';


function Insights() {
  const api = new API();
  const dispatch = useDispatch();

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

  return (
      <div className="page-heading">
        <h1 className="title">Simulation Results </h1>
        <button className='twin-btn' onClick={getResultTableNames}>Get result tables</button>
        <ResultList getColumns={getColumns}/>
      </div>
    );

}

export default Insights;
