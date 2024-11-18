import { useState } from "react";
import axios from "axios";
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
  const initialFormData = {
    itemCode: "",
    itemName: "",
    category: "",
    quantity: "",
    rate: "",
    location: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://retail-daddy-backend.onrender.com/api/v1/invoices/create", // Adjust endpoint accordingly
        formData
      );
      alert(response.data.message);
      setFormData(initialFormData); // Reset the form
      onFormSubmit(); // Notify parent to refresh the table
    } catch (error) {
      console.error(error);
    }
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
