// dataReducer.js
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
            return {
                ...state,
                selectableDates: action.payload,
                minDate: Math.min(...selectableDates),
                maxDate: Math.max(...selectableDates),
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
