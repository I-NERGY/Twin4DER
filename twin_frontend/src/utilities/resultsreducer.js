const initialState = {
    table_names: [],
    columns: [],
    times: [],
    dataOfSelectedColumn: [],
};

const resultsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TABLE_NAMES':
            return {
                ...state,
                table_names: action.payload,
            };
        case 'SET_COLUMNS':
            return {
                ...state,
                columns: action.payload,
            };
        case 'SET_TIMES':
            return {
                ...state,
                times: action.payload,
            };
        case 'SET_COLUMN_DATA':
            return {
                ...state,
                dataOfSelectedColumn: action.payload,
            };
        default:
            return state;
    }
};

export default resultsReducer;