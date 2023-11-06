import axios from 'axios';

class API {

    async executeGETrequest(url) {
        try {
            const response = await axios.get(url);
            return { type: 'ADD_LOG', payload: response.data.message };
        } catch (error) {
            return { type: 'ADD_LOG', payload: error.message };
        }
    }

    async fetchData(url, actiontype, datatype) {
        try {
            const response = await axios.get(url);
            const actions = [];
            actions.push({ type: 'ADD_LOG', payload: response.data.message });
            actions.push({ type: actiontype, payload: response.data[datatype] });

            return actions;
        } catch (error) {
            return { type: 'ADD_LOG', payload: error.message };
        }
    };

}

export default API;