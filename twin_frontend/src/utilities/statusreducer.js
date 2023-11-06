const initialState = {
    logs: [],
    initialized: false,
};

function formatTimestamp(date) {
    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${hour}:${minutes}:${seconds}`;
  }

const statusReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_LOG':
            const newDate = formatTimestamp(new Date(Date.now()));
            const newLog = { date: newDate, msg: action.payload};
            return {
                ...state,
                logs: [...state.logs, newLog],
            };
        case 'INITIALIZE':
            return {
                ...state,
                initialized: true,
            };
        default:
            return state;
    }
};

export default statusReducer;
