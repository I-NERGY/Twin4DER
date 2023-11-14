const initialState = {
    table_names: [],
    columns: [],
    times: [],
    dataColumns: [],
    selectedColumns:[],
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
        case 'ADD_COLUMN_DATA':
            return {
                ...state,
                dataColumns: [
                    ...state.dataColumns,
                    {
                        columnName: action.columnName,
                        columnData: action.columnData,
                    },
                ],
                selectedColumns: [ ...state.selectedColumns, action.columnName ],
            };
        case 'REMOVE_COLUMN_DATA':
            return {
                ...state,
                dataColumns: state.dataColumns.filter((column) => column.columnName !== action.columnName),
                selectedColumns: state.selectedColumns.filter((column) => column !== action.columnName),
            };
        case 'RESET_COLUMN_DATA':
            return {
                ...state,
                dataColumns: [],
                selectedColumns: [],
            };
        default:
            return state;
    }
};

export default resultsReducer;