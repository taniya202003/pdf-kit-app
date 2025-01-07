import React, { useRef, useEffect, useContext, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Context } from "../context/TableContext";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import { CustomModle } from "./CustomModle";

export const Table = () => {
  const tableRef = useRef();
  const ref = tableRef;
  const [checkedRow, setCheckedRow] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [tempRowData, setTempRowData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage] = useState(8);
  const { data, setData, deletePerRow, editRow } = useContext(Context);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isDeleteAll, setIsDeleteAll] = useState(false);

  // pagination
  const indexOfLastItem = currentPage * userPerPage;
  const indexOfFirstItem = indexOfLastItem - userPerPage;
  const updatedData = data.slice(indexOfFirstItem, indexOfLastItem);
  const numberOfPages = Math.ceil(data.length / userPerPage);

  useEffect(() => {
    const getData = JSON.parse(localStorage.getItem("fileData")) || [];
    if (getData.length > 0) {
      setData(getData);
    }
  }, []);

  const OnChangeTable = (e, index) => {
    const { name, value } = e.target;
    setTempRowData({ ...tempRowData, [name]: value });
  };

  const handleRemove = (index) => {
    setDeleteIndex(index);
    setModalMessage("Are you sure you want to delete this row?");
    setIsModalOpen(true);
    setIsDeleteAll(false);
  };

  const handleDeleteAll = () => {
    setModalMessage("Are you sure you want to delete all selected rows?");
    setIsModalOpen(true);
    setIsDeleteAll(true);
  };

  const handleEdit = (index, rowsData) => {
    setEditingRow(index);
    setTempRowData({ ...rowsData });
  };

  const handleKeyPress = (e, index) => {
    if (e.key === "Enter") {
      editRow(tempRowData, index);
      setEditingRow(null);
    }
  };

  const prevBtn = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  const nextBtn = () => {
    if (currentPage !== numberOfPages) setCurrentPage(currentPage + 1);
  };

  const handleCheckBoxChange = (index) => {
    const updateChechkedRows = checkedRow.includes(index)
      ? checkedRow.filter((_, i) => i !== index)
      : [...checkedRow, index];
    setCheckedRow(updateChechkedRows);
  };

  const handleSelectAll = () => {
    if (isChecked) {
      setCheckedRow([]);
    } else {
      const checkAll = data.map((_, i) => i);
      setCheckedRow(checkAll);
    }
    setIsChecked(!isChecked);
  };

  const confirmDelete = () => {
    if (isDeleteAll) {
      const remainingData = data.filter((_, i) => !checkedRow.includes(i));
      setData(remainingData);
      setCheckedRow([]);
      setIsChecked(false);
    } else {
      deletePerRow(deleteIndex);
      setTempRowData({})
    }
    setIsModalOpen(false);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  // this function is used to create or genrate PDF file
  const printPdfDocument = () => {
    const input = tableRef.current;
    if (!input) {
      console.error("Element with ref 'tableRef' not found.");
      return;
    }
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width
      const pageHeight = 295; // A4 height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("table.pdf");
    });
  };

  // this function is used to create or genrate Excel file
  const printToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "useerData.xlsx");
  };

  return (
    <div className="table-container">
      {isModalOpen && (
        <CustomModle
          message={modalMessage}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}

      <div className="table-container-two">
        <div className="main-table-div">
          <h3>USER DATA</h3>
          <div style={{ marginTop: "1rem" }}>
            <div className="removeAll-btn-div">
              <div className="table-header-div">
                <div className="userLength">Total Users: {data.length}</div>
                <div className="userLength">Users Per Page: {userPerPage}</div>
                {/* {data.length <= 0 ? (
                  <div className="userLength">Users Length: 0</div>
                ) : (
                  <div className="userLength">
                    Users Length: {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, data.length)}
                  </div>
                )} */}
              </div>
              <div className="table-header-div">
                <p className="table-selectAll">
                  <input
                    type="checkbox"
                    name="checkboxAll"
                    checked={isChecked}
                    onChange={handleSelectAll}
                  />
                  Select All
                </p>
                <button className="removeAll-btn" onClick={handleDeleteAll}>
                  <MdDelete size={18} /> Delete All
                </button>
              </div>
            </div>

            <div className="table-div">
              <table className="table" ref={ref}>
                <thead>
                  <tr>
                    <th>Select Row</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Edit Row</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {updatedData.map((val, i) => (
                    <tr key={i}>
                      <td className="table-td">
                        <input
                          type="checkbox"
                          name="checked"
                          checked={checkedRow.includes(i)}
                          onChange={(e) => handleCheckBoxChange(i)}
                        />
                      </td>
                      {editingRow === i ? (
                        <>
                          <td>
                            <input
                              className="table-input"
                              type="text"
                              name="name"
                              value={tempRowData.name}
                              onChange={(e) => OnChangeTable(e, i)}
                              onKeyPress={(e) => handleKeyPress(e, i)}
                            />
                          </td>
                          <td>
                            <input
                              className="table-input"
                              type="email"
                              name="email"
                              value={tempRowData.email}
                              onChange={(e) => OnChangeTable(e, i)}
                              onKeyPress={(e) => handleKeyPress(e, i)}
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ width: "28%" }}>{val.name}</td>
                          <td style={{ width: "28%" }}>{val.email}</td>
                        </>
                      )}
                      <td className="table-td">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(i, val)}
                        >
                          <FaEdit size={19} />
                        </button>
                      </td>
                      <td className="table-td">
                        <button
                          className="delete-btn"
                          onClick={() => handleRemove(i)}
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="table-footer-btn">
          <div className="btns">
            <div className="table-files-btns">
              <button className="excel-btn" onClick={printToExcel}>
                Create Excel
              </button>
              <button className="pdf-btn" onClick={printPdfDocument}>
                Create PDF
              </button>
            </div>

            <div className="table-prev-next-btns">
              <button className="prev-btn" onClick={prevBtn}>
                <TbPlayerTrackPrevFilled size={20} />
              </button>
              <button className="next-btn" onClick={nextBtn}>
                <TbPlayerTrackNextFilled size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
