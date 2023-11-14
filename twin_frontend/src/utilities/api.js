import axios from 'axios';
import { useDispatch } from 'react-redux';

class API {
    constructor() {
        this.dispatch = useDispatch();
    }

    async executeGETrequest(url) {
        try {
            const response = await axios.get(url);
            this.dispatch({ type: 'ADD_LOG', payload: response.data.message });
        } catch (error) {
            this.dispatch({ type: 'ADD_LOG', payload: error.message });
        }
    }

    async fetchData(url, actiontype, datatype) {
        try {
            const response = await axios.get(url);
            this.dispatch({ type: 'ADD_LOG', payload: response.data.message });
            return response;
        } catch (error) {
            this.dispatch({ type: 'ADD_LOG', payload: error.message });
        }
    };

    async delete(url) {
        try {
            const response = await axios.delete(url);
            this.dispatch({ type: 'ADD_LOG', payload: response.data.message });
        } catch (error) {
            this.dispatch({ type: 'ADD_LOG', payload: error.message });
        }
    }
}

export default API;