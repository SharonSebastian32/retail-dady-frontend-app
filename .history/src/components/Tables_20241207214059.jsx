import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
} from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { RxEyeOpen } from "react-icons/rx";
import FormDialog from "./Childrens/FormDialogue";
import ViewDialog from "./Childrens/ViewDetails.jsx"; // Import ViewDialog

function Tables({ refresh }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const toast = useRef(null);
  const [selectedRow, setSelectedRow] = useState(null); // For FormDialog and ViewDialog
  const [viewMode, setViewMode] = useState(false); // Track if the view dialog is open
  const showToast = (severity, summary, detail) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000,
    });
  };

  useEffect(() => {
    fetchInvoices();
  }, [refresh]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/v1/invoices/getall",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data.reverse());
    } catch (error) {
      console.error("Error fetching invoices:", error);
      showToast(
        "error",
        "Error",
        "Failed to fetch Stock. Please try again later."
      );
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete Stock?",
      header: "Delete",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(id),
      reject: () =>
        showToast("info", "Cancelled", "Delete operation cancelled"),
    });
  };

  const handleDelete = async (id) => {
    if (!id) {
      showToast("error", "Error", "No Stock ID provided for deletion");
      return;
    }
    try {
      const response = await axios.delete(
        import.meta.env.VITE_API_URL + `/api/v1/invoices/delete/${id}`
      );
      if (response.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        showToast("success", "Success", "Item deleted successfully!");
      } else {
        showToast("error", "Error", "Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      showToast("error", "Error", "Failed to delete item.");
    }
  };

  const findDocumentAndUpdate = (row) => {
    setSelectedRow(row);
    setViewMode(false); // Set to false when editing, as it should show the form dialog
  };

  const viewDocument = (row) => {
    setSelectedRow(row);
    setViewMode(true); // Set to true when viewing, to show the view dialog
  };

  const getDiscount = (category) => {
    switch (category) {
      case "Vegetables":
        return 10;
      case "Stationaries":
        return 3;
      case "Fruits":
        return 5;
      default:
        return 0;
    }
  };

  const getCategoryAbbreviation = (category) => {
    switch (category) {
      case "Vegetables":
        return "VEG";
      case "Stationaries":
        return "STR";
      case "Fruits":
        return "FRT";
      default:
        return category;
    }
  };

  const handleEdit = async () => {
    try {
      await fetchInvoices();
      showToast("success", "Success", "Updated successfully!");
    } catch (error) {
      console.error("Error handling submit:", error);
      showToast(
        "error",
        "Error",
        "Failed to update data. Please try again later."
      );
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <Paper  sx={{ padding: 2 }}>
      <Toast ref={toast} />
      <ConfirmDialog />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Item Code",
                "Item Name",
                "Category",
                "Quantity",
                "Rate",
                "Price",
                "Discount",
                "Amount",
                "Location",
                "Actions",
              ].map((header) => (
                <TableCell key={header} style={{ fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row, index) => {
              const discount = getDiscount(row.category);
              const price = row.quantity * (row.rate || 0);
              const amountPay = (price - (price * discount) / 100).toFixed(2);
              return (
                <TableRow
                  key={row._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f0f0f0",
                    cursor: "pointer",
                  }}
                >
                  <TableCell>{row.itemCode}</TableCell>
                  <TableCell>{row.itemName}</TableCell>
                  <TableCell>{getCategoryAbbreviation(row.category)}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.rate?.toFixed(2) || "-"}</TableCell>
                  <TableCell>{price.toFixed(2) || "-"}</TableCell>
                  <TableCell>{`${discount}%`}</TableCell>
                  <TableCell>{amountPay}</TableCell>
                  <TableCell>{row.location || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-2">
                      <IconButton
                        onClick={() => confirmDelete(row._id)}
                        aria-label="delete"
                        className="hover:bg-red-100"
                      >
                        <MdDeleteOutline color="red" />
                      </IconButton>
                      <IconButton
                        onClick={() => findDocumentAndUpdate(row)} // Open FormDialog for edit
                        aria-label="edit"
                        className="hover:bg-green-100"
                      >
                        <CiEdit color="green" />
                      </IconButton>
                      <IconButton
                        onClick={() => viewDocument(row)} // Open ViewDialog for viewing
                        aria-label="view"
                        className="hover:bg-gray-100"
                      >
                        <RxEyeOpen color="black" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, page) => setCurrentPage(page)}
        sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
      />
      {/* Show FormDialog if editing, and ViewDialog if viewing */}
      {selectedRow && !viewMode && (
        <FormDialog
          open={!!selectedRow} // Open FormDialog if row is selected
          handleClose={() => setSelectedRow(null)} // Close FormDialog
          rowData={selectedRow} // Pass rowData for editing
          handleSubmit={handleEdit}
        />
      )}
      {selectedRow && viewMode && (
        <ViewDialog
          open={!!selectedRow} // Open ViewDialog if row is selected
          handleClose={() => setSelectedRow(null)} // Close ViewDialog
          rowData={selectedRow} // Pass rowData for viewing
        />
      )}
    </Paper>
  );
}

export default Tables;
