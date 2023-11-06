const initialState = {
    table_names: [],
};

const resultsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TABLE_NAMES':
            return {
                ...state,
                table_names: action.payload,
            };
        default:
            return state;
    }
};

export default resultsReducer;