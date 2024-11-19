import { useState, useRef } from "react";
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    try {
      const response = await fetch(
        "https://retail-daddy-backend.onrender.com/api/v1/invoices/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: data.message || "Form submitted successfully!",
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
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.message || "Something went wrong!",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to submit form. Please try again.",
        life: 3000,
      });
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVisible(true);
  };

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

  return (
    <Box
      style={{
        marginTop: "9px",
        padding: "40px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        gap: "28px",
      }}
      component="form"
      onSubmit={handleSubmit}
      sx={{
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
        message="Are you sure you want to submit this form?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
      />

      {/* Item Code */}
      <TextField
        label="Item Code"
        name="itemCode"
        value={formData.itemCode}
        onChange={handleChange}
        placeholder="Enter Item Code"
        required
      />

      {/* Item Name */}
      <TextField
        label="Item Name"
        name="itemName"
        value={formData.itemName}
        onChange={handleChange}
        placeholder="Enter Item Name"
        required
      />

      {/* Category */}
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <MenuItem value="">
            <em>Select Category</em>
          </MenuItem>
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
      />

      {/* Location */}
      <FormControl fullWidth>
        <InputLabel id="location-label">Location</InputLabel>
        <Select
          labelId="location-label"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        >
          <MenuItem value="">
            <em>Select Location</em>
          </MenuItem>
          <MenuItem value="Calicut">Calicut</MenuItem>
          <MenuItem value="Malappuram">Malappuram</MenuItem>
          <MenuItem value="Thrissur">Thrissur</MenuItem>
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        style={{ backgroundColor: "grey" }}
      >
        Submit
      </Button>
    </Box>
  );
}

export default Form;
