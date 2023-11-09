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
        const actions = [];
        try {
            const response = await axios.get(url);
            actions.push({ type: 'ADD_LOG', payload: response.data.message });
            actions.push({ type: actiontype, payload: response.data[datatype] });
        } catch (error) {
            actions.push({ type: 'ADD_LOG', payload: error.message });
        }
        return actions;
    };

    async delete(url) {
        try {
            const response = await axios.delete(url);
            return { type: 'ADD_LOG', payload: response.data.message };
        } catch (error) {
            return { type: 'ADD_LOG', payload: error.message };
        }
    }
}

export default API;