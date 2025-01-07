import React, { useContext, useRef, useState } from "react";
import { Context } from "../context/TableContext";
import * as XLSX from "xlsx";
import { PreviewTable } from "./PreviewTable";
import { useNavigate } from "react-router-dom";

export const Form = () => {
  const fileInputRef = useRef(null); // this reference is created for hidden file input to trigger onClick function
  const [fileUploaded, setFileUploaded] = useState(false);
  const [userAdded, setUserAdded] = useState(false);
  const { inputValues, setInputValues, setPreviewData, addNewData } =
    useContext(Context);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewData();
    setUserAdded(true);
  };

  // this function is used to upload excel files
  const uploadFile = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader(); // this function helps to read code in an asynchronous way
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet); // converts sheet data into JSON format
        setPreviewData(json);
        setFileUploaded(true); // set file uploaded to true
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // this is to trigger the import file button
  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="form-container">
      <div className="form-div">
        <form onSubmit={handleSubmit} className="table-form">
          <h2>USER REGISTRATION FORM</h2>
          <div className="formData">
            <div className="form-inputDiv">
              <label>Name:</label>
              <input
                className="input"
                type="text"
                placeholder="Enter your name"
                name="name"
                value={inputValues.name}
                onChange={handleOnChange}
                required
              />
              <label>Email:</label>
              <input
                className="input"
                type="email"
                placeholder="Enter your email"
                name="email"
                value={inputValues.email}
                onChange={handleOnChange}
                required
              />
            </div>

            <div className="form-btns">
              <button className="add-btn" type="submit">
                Add New User
              </button>

              <b>or</b>

              <div className="upload-div">
                <input
                  className="uploadFile-input"
                  type="file"
                  ref={fileInputRef} // Attach ref to the input
                  onChange={uploadFile}
                  style={{ display: "none" }} // Hide the input
                />
                <button
                  className="import-btn"
                  type="button"
                  onClick={triggerFileUpload}
                >
                  Import CSV File
                </button>
              </div>
            </div>
            {userAdded ? (
              <div className="userData-navigation-btn">
                <button
                  className="goToUserBtn"
                  onClick={() => navigate("/userData")}
                >
                  Go To User Data
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </form>
      </div>

      {fileUploaded && (
        <div className="previewTable-data">
          <PreviewTable />
        </div>
      )}
    </div>
  );
};
