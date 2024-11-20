import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";

export default function FormDialog({
  open,
  handleClose,
  rowData,
  handleSubmit,
}) {
  const [itemName, setItemName] = useState(rowData?.itemName || "");
  const [itemCode, setItemCode] = useState(rowData?.itemCode || "");
  const [quantity, setQuantity] = useState(rowData?.quantity || "");
  const [rate, setRate] = useState(rowData?.rate || "");
  const [category, setCategory] = useState(rowData?.category || "");
  const [location, setLocation] = useState(rowData?.location || "");

  useEffect(() => {
    if (rowData) {
      setItemName(rowData.itemName);
      setItemCode(rowData.itemCode);
      setQuantity(rowData.quantity);
      setRate(rowData.rate);
      setCategory(rowData.category);
      setLocation(rowData.location);
    }
  }, [rowData]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const updatedData = {
      itemName,
      quantity,
      rate,
      category,
      location,
    };

    handleSubmit(updatedData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To update this item, please edit the details below and submit.
        </DialogContentText>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            {/* Left Side Form */}
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                label="Item Code"
                type="text"
                fullWidth
                variant="standard"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Item Name"
                type="text"
                fullWidth
                variant="standard"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <MenuItem value="Fruits">Fruits</MenuItem>
                  <MenuItem value="Vegetables">Vegetables</MenuItem>
                  <MenuItem value="Stationaries">Stationaries</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={16} sm={6}>
              <TextField
                margin="dense"
                label="Quantity"
                type="number"
                fullWidth
                variant="standard"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Rate"
                type="number"
                fullWidth
                variant="standard"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="location-label">Location</InputLabel>
                <Select
                  labelId="location-label"
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                >
                  <MenuItem value="Calicut">Calicut</MenuItem>
                  <MenuItem value="Malappuram">Malappuram</MenuItem>
                  <MenuItem value="Thrissur">Thrissur</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} style={{ color: "red" }}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleFormSubmit}
          style={{ color: "black", fontWeight: "bold" }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
