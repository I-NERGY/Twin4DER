import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';


// TODO: store selected dates, they are not actually used yet!

const DateSelector = () => {
    const dispatch = useDispatch();
    const selectableDates = useSelector((state) => state.selectableDates);
    const startDate = useSelector((state) => state.selectableDates);
    const endDate = useSelector((state) => state.selectableDates);

    // Calculate the minimum and maximum values from the array
    //const minDate = Math.min(...selectableDates);
    //const maxDate = Math.max(...selectableDates);

    const isDateSelectable = (date) => {
        return selectableDates.some((selectableDate) =>
            selectableDate.toDateString() === date.toDateString()
        );
    };

    const setStartDate = (date) => {
        dispatch({ type: 'SELECT_START', payload: date });
    };

    const setEndDate = (date) => {
        dispatch({ type: 'SELECT_END', payload: date });
    };

    return (
        <div>
            <p>Simulation input starting Date:</p>
            <DatePicker
                selected={selectedStart}
                minDate={minDate}
                maxDate={maxDate}
                filterDate={(date) => isDateSelectable(date)}
                onChange={(date) => setStartDate(date)}
            />
            <p>Simulation input end Date:</p>
            <DatePicker
                selected={selectedEnd}
                minDate={startDate}
                maxDate={maxDate}
                filterDate={(date) => isDateSelectable(date)}
                onChange={(date) => setEndDate(date)}
            />
        </div>
    );
};

export default DateSelector;