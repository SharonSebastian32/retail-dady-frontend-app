import { useState } from "react";
import axios from "axios";

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
        "https://retail-daddy-backend.onrender.com/api/v1/invoices/create",
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
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "6px" }}
    >
      {/* Form fields */}
      <label htmlFor="itemCode" style={{ textAlign: "left" }}>
        Item Code
      </label>
      <input
        style={{ padding: "6px 13px", fontSize: "15px" }}
        type="text"
        name="itemCode"
        id="itemCode"
        value={formData.itemCode}
        onChange={handleChange}
        placeholder="Enter Item Code"
        required
      />
      <label htmlFor="itemName" style={{ textAlign: "left" }}>
        Item Name
      </label>
      <input
        style={{ padding: "6px 13px", fontSize: "15px" }}
        type="text"
        name="itemName"
        id="itemName"
        value={formData.itemName}
        onChange={handleChange}
        placeholder="Enter Item Name"
        required
      />
      <label htmlFor="category" style={{ textAlign: "left" }}>
        Category
      </label>
      <select
        style={{ padding: "6px 13px", fontSize: "15px" }}
        name="category"
        id="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Select Category"
        required
      >
        <option value="">Select Category</option>
        <option value="Fruits">Fruits</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Stationaries">Stationaries</option>
      </select>
      <label htmlFor="quantity" style={{ textAlign: "left" }}>
        Quantity
      </label>
      <input
        style={{ padding: "6px 13px", fontSize: "15px" }}
        type="number"
        name="quantity"
        id="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Enter Quantity"
        required
      />
      <label htmlFor="rate" style={{ textAlign: "left" }}>
        Rate
      </label>
      <input
        style={{ padding: "6px 13px", fontSize: "15px" }}
        type="number"
        name="rate"
        id="rate"
        value={formData.rate}
        onChange={handleChange}
        placeholder="Enter Rate"
        required
      />
      <label htmlFor="location" style={{ textAlign: "left" }}>
        Location
      </label>
      <select
        style={{ padding: "6px 13px", fontSize: "15px" }}
        name="location"
        id="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Select Location"
        required
      >
        <option value="">Select Location</option>
        <option value="Calicut">Calicut</option>
        <option value="Malappuram">Malappuram</option>
        <option value="Thrissur">Thrissur</option>
      </select>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
