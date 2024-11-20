import { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MenuItem, Select, FormControl, InputLabel, Grid } from "@mui/material";
import { Toast } from "primereact/toast";
import Pagination from "@mui/material/Pagination";

export default function ViewDialog({ open, handleClose, rowData }) {
  const [itemName, setItemName] = useState(rowData?.itemName);
  const [itemCode, setItemCode] = useState(rowData?.itemCode);
  const [quantity, setQuantity] = useState(rowData?.quantity);
  const [rate, setRate] = useState(rowData?.rate);
  const [category, setCategory] = useState(rowData?.category);
  const [location, setLocation] = useState(rowData?.location);
  const [discount, setDiscount] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 1;

  const toast = useRef(null);

  useEffect(() => {
    if (rowData) {
      setItemName(rowData.itemName);
      setItemCode(rowData.itemCode);
      setQuantity(rowData.quantity);
      setRate(rowData.rate);
      setCategory(rowData.category);
      setLocation(rowData.location);

      const itemDiscount = getDiscountByCategory(rowData.category);
      setDiscount(itemDiscount);
    }
  }, [rowData]);

  const getDiscountByCategory = (category) => {
    switch (category) {
      case "Fruits":
        return 5;
      case "Vegetables":
        return 10;
      case "Stationaries":
        return 3;
      default:
        return 0;
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  const calculatePrice = (quantity, rate) => {
    return (quantity * rate).toFixed(2);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const price = calculatePrice(quantity, rate);
  const discountedPrice = (price - (price * discount) / 100).toFixed(2);

  return (
    <div>
      <Toast ref={toast} />
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>View Item</DialogTitle>
        <DialogContent>
          <DialogContentText>The details of this Item.</DialogContentText>

          {/* Page 1: Basic Item Details */}
          {page === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Item Code"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={itemCode}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Item Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={itemName}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    label="Category"
                    value={category}
                    readOnly
                    disabled
                  >
                    <MenuItem value="Fruits">Fruits</MenuItem>
                    <MenuItem value="Vegetables">Vegetables</MenuItem>
                    <MenuItem value="Stationaries">Stationaries</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Quantity"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={quantity}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Rate"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={rate}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="location-label">Location</InputLabel>
                  <Select
                    labelId="location-label"
                    label="Location"
                    value={location}
                    disabled
                  >
                    <MenuItem value="Calicut">Calicut</MenuItem>
                    <MenuItem value="Malappuram">Malappuram</MenuItem>
                    <MenuItem value="Thrissur">Thrissur</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Page 2: Additional Details (Price, Discount, Amount) */}
          {page === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Price"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={price}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Discount"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={`${discount}%`}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Amount After Discount"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={discountedPrice}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          )}

          <div style={{ display: "flex", justifyContent: "center" }}>
            {" "}
            <Pagination
              count={2} // Two pages (Page 1 and Page 2)
              page={page}
              onChange={handlePageChange}
              sx={{ mt: 3 }}
            />
          </div>

          <DialogActions>
            <Button onClick={handleCancel} style={{ color: "red" }}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
