import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MenuItem, Select, FormControl, InputLabel, Grid } from "@mui/material";
import { Toast } from "primereact/toast";

export default function FormDialog({
  open,
  handleClose,
  rowData,
  handleSubmit,
}) {
  const [itemName, setItemName] = useState(rowData?.itemName);
  const [itemCode, setItemCode] = useState(rowData?.itemCode);
  const [quantity, setQuantity] = useState(rowData?.quantity);
  const [rate, setRate] = useState(rowData?.rate);
  const [category, setCategory] = useState(rowData?.category);
  const [location, setLocation] = useState(rowData?.location);
  const toast = useRef(null);

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

  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const updatedData = {
      itemName,
      itemCode,
      quantity,
      rate,
      category,
      location,
    };

    try {
      const response = await axios.put(
        import.meta.env.VITE_API_URL + `/api/v1/invoices/update/${rowData._id}",
        updatedData
      );

      if (response.status === 200) {
        if (handleSubmit) {
          await handleSubmit(updatedData);
        }

        if (handleClose) {
          handleClose();
        }
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail:
          error.response?.data?.message ||
          "Error updating item. Please try again.",
        life: 3000,
      });
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <div>
      <Toast ref={toast} />
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To update this item, please edit the details below and submit.
          </DialogContentText>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={3}>
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
              <Grid item xs={12} sm={6}>
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

            <DialogActions>
              <Button onClick={handleCancel} style={{ color: "red" }}>
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ color: "black", fontWeight: "bold" }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
