import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

function Tables({ refresh }) {
  const [data, setData] = useState([]); // State to hold the fetched data
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          "https://retail-daddy-backend.onrender.com/api/v1/invoices/getall/",
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

  // Table styles
  const cellStyle = { border: "1px solid #ddd", padding: "8px" };
  const paginationButtonStyle = (isActive) => ({
    margin: "0 5px",
    padding: "5px 10px",
    border: isActive ? "2px solid grey" : "1px solid black",
    backgroundColor: isActive ? "grey" : "black",
    color: "white",
    cursor: "pointer",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {[
              // "item _id",
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
              <th key={header} style={cellStyle}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, _id) => {
            const discount = getDiscount(row.category);
            const price = row.quantity * (row.rate || 0);
            const amountPay = (price - (price * discount) / 100).toFixed(2);

            return (
              <tr key={_id}>
                {/* <td style={cellStyle}>{row._id}</td> */}
                <td style={cellStyle}>{row.itemCode}</td>
                <td style={cellStyle}>{row.itemName}</td>
                <td style={cellStyle}>{row.category}</td>
                <td style={cellStyle}>{row.quantity}</td>
                <td style={cellStyle}>{row.rate?.toFixed(2) || "-"}</td>
                <td style={cellStyle}>{price.toFixed(2) || "-"}</td>
                <td style={cellStyle}>{`${discount}%`}</td>
                <td style={cellStyle}>{amountPay}</td>
                <td style={cellStyle}>{row.location || "-"}</td>
                <td style={cellStyle}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <MdDeleteOutline
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={findDocumentAndDelete}
                    />
                    <CiEdit
                      style={{ color: "yellow", cursor: "pointer" }}
                      onClick={findDocumentAndUpdate}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, page) => page + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={paginationButtonStyle(currentPage === page)}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Tables;
