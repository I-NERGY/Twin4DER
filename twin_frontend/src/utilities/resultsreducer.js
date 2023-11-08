const initialState = {
    table_names: [],
    columns: [],
};

const resultsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TABLE_NAMES':
            return {
                ...state,
                table_names: action.payload,
            };
        case 'SET_COLUMS':
            return {
                ...state,
                columns: action.payload,
            };
        default:
            return state;
    }
};

export default resultsReducer;