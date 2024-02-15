import axios from 'axios';
import { useDispatch } from 'react-redux';
//import { useEffect } from 'react';

const useAPI = () => {
    const dispatch = useDispatch();

    const executeGETrequest = async(url) => {
        try {
            const response = await axios.get(url);
            dispatch({ type: 'ADD_LOG', payload: response.data.message });
        } catch (error) {
            dispatch({ type: 'ADD_LOG', payload: error.message });
        }
    }

    const fetchData = async(url) => {
        try {
            const response = await axios.get(url);
            dispatch({ type: 'ADD_LOG', payload: response.data.message });
            return response;
        } catch (error) {
            dispatch({ type: 'ADD_LOG', payload: error.message });
        }
    };

    const deleteData = async(url) => {
        try {
            const response = await axios.delete(url);
            dispatch({ type: 'ADD_LOG', payload: response.data.message });
        } catch (error) {
            dispatch({ type: 'ADD_LOG', payload: error.message });
        }
    };

    /*
    useEffect(() => {
        fetchData();
      }, [url]);
    */
    return { executeGETrequest, fetchData, deleteData };
}

export default useAPI;