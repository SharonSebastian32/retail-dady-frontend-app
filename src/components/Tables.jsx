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

function Tables({ refresh }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const toast = useRef(null);

  useEffect(() => {
    fetchInvoices();
  }, [refresh]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/invoices/getall",
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
        "Failed to fetch invoices. Please try again later."
      );
    }
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000,
    });
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this  stock?",
      header: "Delete Confirmation",
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
        `http://localhost:3000/api/v1/invoices/delete/${id}`
      );

      if (response.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        showToast("success", "Success", "Item deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      showToast(
        "error",
        "Error",
        error.response?.data?.message || "Failed to delete item."
      );
    }
  };

  const findDocumentAndUpdate = (id) => {
    confirmDialog({
      message: "Are you sure you want to update this Stock?",
      header: "Update Confirmation",
      icon: "pi pi-exclamation-circle",
      accept: () => {
        console.log("Stock updated!", id);
        showToast("success", "Success", "Stock updated successfully!");
      },
      reject: () =>
        showToast("info", "Cancelled", "Update operation cancelled"),
    });
  };

  const viewDocument = (id) => {
    // Add your view logic here
    console.log("Viewing document:", id);
    showToast("info", "Info", "Viewing Stock details");
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

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <Paper elevation={1} sx={{ padding: 2 }}>
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
                        onClick={() => findDocumentAndUpdate(row._id)}
                        aria-label="edit"
                        className="hover:bg-green-100"
                      >
                        <CiEdit color="green" />
                      </IconButton>
                      <IconButton
                        onClick={() => viewDocument(row._id)}
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
    </Paper>
  );
}

export default Tables;
