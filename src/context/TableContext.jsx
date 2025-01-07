import React, { createContext, useState } from "react";

export const Context = createContext()

const inputs = {
    name: "",
    email: "",
  };

export const TableContext = ({children}) => {
    const [data, setData] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [inputValues, setInputValues] = useState(inputs);

    const editRow = (e, index) => {
        const updatedData = [...data];
        updatedData[index] = e
        setData(updatedData);
        localStorage.setItem("fileData", JSON.stringify(updatedData));
    }

    const addNewData = () => {
        let prevData = JSON.parse(localStorage.getItem("fileData"));
        if (!Array.isArray(prevData)) {
          prevData = [];
        }
        const updatedData = [...prevData, inputValues];
        setData(updatedData);
        localStorage.setItem("fileData", JSON.stringify(updatedData));
        setInputValues(inputs);
    }

    const deletePerRow = (index) => {
        const filterRemoved = data.filter((_, i) => i !== index);
        setData(filterRemoved);
        localStorage.setItem("fileData", JSON.stringify(filterRemoved));
    }

    const deletePreviewRow = (index) => {
        const filterRemoved = previewData.filter((_, i) => i !== index);
        setPreviewData(filterRemoved);
    }

    return(
        <Context.Provider value={{data, setData, inputValues, setInputValues, previewData, setPreviewData, addNewData, deletePerRow, editRow, deletePreviewRow}}>
            {children}
        </Context.Provider>
    )
}