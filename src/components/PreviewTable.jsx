import React, { useContext, useState } from "react";
import { Context } from "../context/TableContext";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdOutlineAdd } from "react-icons/md";

export const PreviewTable = () => {
  const { data, setData, previewData, setPreviewData, deletePreviewRow } =
    useContext(Context);
    
  const [previewInputs, setPreviewInputs] = useState({
    name: "",
    email: "",
  });

  console.log(previewInputs, "previewInputs");

  const OnChangeTable = (e, index) => {
    const { name, value } = e.target;
    const updatedData = [...previewData];
    updatedData[index][name] = value;
    setPreviewInputs(updatedData);
  };

  const navigate = useNavigate();

  // this is to add preview data in to main table users data
  const addPreviewDataToMain = () => {
    const updatedData = [...data, ...previewData];
    setData(updatedData);
    localStorage.setItem("fileData", JSON.stringify(updatedData));
    setPreviewData([]);
    setTimeout(() => navigate("/userData"), 1000);
  };

  const handleRemove = (index) => {
    deletePreviewRow(index);
  };

  const addNewRow = () => {
    setPreviewData((prev) => [...prev, { name: "", eamil: "" }]);
  };

  return (
    <div className="previewTable-container">
      <h2>Preview Data</h2>
      <div className="addRow-btnDiv-preview">
        <button className="addRow-btn-preview" onClick={addNewRow}>
          Add Row <MdOutlineAdd />
        </button>
      </div>
      <div className="preview-data">
        {previewData.length > 0 && (
          <div className="preview-table-div">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((val, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        className="preview-input"
                        type="text"
                        name="name"
                        value={val.name}
                        onChange={(e) => OnChangeTable(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        className="preview-input"
                        type="email"
                        name="email"
                        value={val.email}
                        onChange={(e) => OnChangeTable(e, i)}
                      />
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleRemove(i)}
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addPreviewDataToMain} className="add-preview-btn">
              Add File Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
