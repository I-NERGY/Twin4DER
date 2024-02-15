import React /*, { useState } */ from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';


const DateSelector = () => {
    const dispatch = useDispatch();
    const dates = useSelector((state) => state.dates);

    const isDateSelectable = (date) => {
        const dateAsString = date.toISOString().substr(0, 10);
        return dates.selectableDates.includes(dateAsString);
    };

    const setStartDate = (date) => {
        dispatch({ type: 'SELECT_START', payload: date });
    };

    const setEndDate = (date) => {
        dispatch({ type: 'SELECT_END', payload: date });
    };

    return (
        <div>
            <p>Start date:</p>
            <DatePicker
                selected={dates.selectedStart ? new Date(dates.selectedStart) : undefined}
                minDate={dates.minDate ? new Date(dates.minDate) : undefined}
                maxDate={dates.maxDate ? new Date(dates.maxDate) : undefined}
                filterDate={(date) => isDateSelectable(date)}
                onChange={(date) => setStartDate(date)}
            />
            <p>End date:</p>
            <DatePicker
                selected={dates.selectedEnd ? new Date(dates.selectedEnd) : undefined}
                minDate={dates.selectedStart ? new Date(dates.selectedStart) : undefined}
                maxDate={dates.maxDate ? new Date(dates.maxDate) : undefined}
                filterDate={(date) => isDateSelectable(date)}
                onChange={(date) => setEndDate(date)}
            />
        </div>
    );
};

export default DateSelector;