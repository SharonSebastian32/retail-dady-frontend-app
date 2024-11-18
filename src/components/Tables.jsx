import { useEffect, useState } from "react";
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
  const [data, setData] = useState([]); // State to hold the fetched data
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // Fetch API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/invoices/getall/", // Replace with production URL as needed
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
        setData(result.data.reverse()); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, [refresh]);

  // Handlers
  const findDocumentAndDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this invoice? It will be deleted permanently."
      )
    ) {
      console.log("Invoice deleted!");
    }
  };

  const findDocumentAndUpdate = () => {
    if (window.confirm("Are you sure you want to update this invoice?")) {
      console.log("Invoice updated!");
    }
  };

  // Utility function for category discount
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

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Render
  return (
    <Paper elevation={1} sx={{ padding: 2 }}>
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
            {currentRows.map((row, rowIndex) => {
              const discount = getDiscount(row.category);
              const price = row.quantity * (row.rate || 0);
              const amountPay = (price - (price * discount) / 100).toFixed(2);

              return (
                <TableRow
                  key={rowIndex}
                  style={{
                    backgroundColor: rowIndex % 2 === 0 ? "#f0f0f0" : "#ffffff",
                    padding: "2px", // Gray for even rows, white for odd rows
                  }}
                >
                  <TableCell>{row.itemCode}</TableCell>
                  <TableCell>{row.itemName}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.rate?.toFixed(2) || "-"}</TableCell>
                  <TableCell>{price.toFixed(2) || "-"}</TableCell>
                  <TableCell>{`${discount}%`}</TableCell>
                  <TableCell>{amountPay}</TableCell>
                  <TableCell>{row.location || "-"}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={findDocumentAndDelete}
                      aria-label="delete"
                    >
                      <MdDeleteOutline color="red" />
                    </IconButton>
                    <IconButton
                      onClick={findDocumentAndUpdate}
                      aria-label="edit"
                    >
                      <CiEdit color="blue" />
                    </IconButton>
                    <IconButton
                      onClick={findDocumentAndUpdate}
                      aria-label="view"
                    >
                      <RxEyeOpen color="black" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
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
