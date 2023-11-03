const initialState = {
    logs: [],
};

const logsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_LOG':
            return {
                ...state,
                logs: [...state.logs, action.payload]
            };
        default:
            return state;
    }
};

export default logsReducer;
