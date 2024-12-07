import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";

function Form({ onFormSubmit }) {
  const toast = useRef(null);
  const itemCodeRef = useRef(null); // Ref for itemCode input
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    category: "",
    quantity: "",
    rate: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/v1/invoices/create", // Fixed syntax error - removed extra parentheses
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Stock added successfully!",
          life: 3000,
        });

        setFormData({
          itemCode: "",
          itemName: "",
          category: "",
          quantity: "",
          rate: "",
          location: "",
        });
        onFormSubmit();
      } else {
        showToastError(data.message || "Something went wrong!");
      }
    } catch (error) {
      showToastError("Failed to add stock. Please try again.");
      console.error(error);
    }
  };

  const showToastError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  // Handle form submission action
  const handleSubmit = (e) => {
    e.preventDefault();
    setVisible(true);
  };

  // Confirmation accept and reject actions
  const accept = () => {
    handleFormSubmit();
    setVisible(false);
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Cancelled",
      detail: "You have cancelled the submission",
      life: 3000,
    });
  };

  // Focus on itemCode input field after form reset
  useEffect(() => {
    if (formData.itemCode === "") {
      itemCodeRef.current?.focus(); // Focus after resetting form data
    }
  }, [formData.itemCode]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        marginTop: "9px",
      
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        gap: "28px",
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
        margin: "0 auto",
      }}
    >
      <Toast ref={toast} />
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="Are you sure you want to add this item to Stock?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
      />

      {/* Item Code */}
      <TextField
        inputRef={itemCodeRef} // Ref for itemCode TextField
        label="Item Code"
        name="itemCode"
        value={formData.itemCode}
        onChange={handleChange}
        placeholder="Enter Item Code"
        required
        fullWidth
      />

      {/* Item Name */}
      <TextField
        label="Item Name"
        name="itemName"
        value={formData.itemName}
        onChange={handleChange}
        placeholder="Enter Item Name"
        required
        fullWidth
      />

      {/* Category */}
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <MenuItem value="Fruits">Fruits</MenuItem>
          <MenuItem value="Vegetables">Vegetables</MenuItem>
          <MenuItem value="Stationaries">Stationaries</MenuItem>
        </Select>
      </FormControl>

      {/* Quantity */}
      <TextField
        label="Quantity"
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Enter Quantity"
        required
        fullWidth
      />

      {/* Rate */}
      <TextField
        label="Rate"
        name="rate"
        type="number"
        value={formData.rate}
        onChange={handleChange}
        placeholder="Enter Rate"
        required
        fullWidth
      />

      {/* Location */}
      <FormControl fullWidth>
        <InputLabel id="location-label">Location</InputLabel>
        <Select
          labelId="location-label"
          name="location"
          label="Location"
          value={formData.location}
          onChange={handleChange}
          required
        >
          <MenuItem value="Calicut">Calicut</MenuItem>
          <MenuItem value="Malappuram">Malappuram</MenuItem>
          <MenuItem value="Thrissur">Thrissur</MenuItem>
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        sx={{ backgroundColor: "grey", width: "100%" }}
      >
        Submit
      </Button>
    </Box>
  );
}

export default Form;
