import React, { useState } from "react";

const ClickableItemList = (props) => {
    
    const handleSelection = (item) => {
        props.onSelection(item);
    };
    
    return (
        <div className="horizontal-element">
            <table className="result-table">
                <tbody>
                    <tr>
                        <th>{props.title}</th>
                    </tr>
                    {props.data.map((item, index) => (
                    <tr key={index}
                        onClick={() => handleSelection(item)}
                        style={{backgroundColor: props.selectedItems && props.selectedItems.includes(item) ? "lightblue" : "white"}}
                        >
                        <td>
                            <p>{item}</p>
                        </td>
                    </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    };

export default ClickableItemList;