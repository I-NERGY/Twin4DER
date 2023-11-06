const initialState = {
    selectableDates: [],
    selectedStart: undefined,
    selectedEnd: undefined,
    minDate: undefined,
    maxDate: undefined
};

// TODO: autom. Überprüfung, ob diese Daten tatsächlich in selectableDates sind
const STARTDATE = "2022-10-21";
const ENDDATE = "2022-10-22";

const datesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_DATES':
            const dateObjects = action.payload.map(dateString => new Date(dateString));
            const minDate = Math.min(...dateObjects);
            const maxDate = Math.max(...dateObjects);
            
            return {
                ...state,
                selectableDates: action.payload,
                minDate: minDate,
                maxDate: maxDate,
                selectedStart: STARTDATE,
                selectedEnd: ENDDATE,
            };
        case 'SELECT_START':
            return {
                ...state,
                selectedStart: action.payload,
            };
        case 'SELECT_END':
            return {
                ...state,
                selectedEnd: action.payload,
            }
        default:
            return state;
    }
};

export default datesReducer;
