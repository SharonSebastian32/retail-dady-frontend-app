import { useRef, useState } from "react";
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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function FormikForm({ onFormSubmit }) {
  const toast = useRef(null);
  const itemCodeRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [tempValues, setTempValues] = useState(null);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    itemCode: Yup.string().required("Item Code is required"),
    itemName: Yup.string().required("Item Name is required"),
    category: Yup.string().required("Category is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .positive("Quantity must be positive"),
    rate: Yup.number()
      .required("Rate is required")
      .positive("Rate must be positive"),
    location: Yup.string().required("Location is required"),
  });

  const handleFormSubmit = async (values, resetForm) => {
    try {
      const response = await fetch(
        "https://retail-daddy-backend.onrender.com/api/v1/invoices/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
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
        resetForm();
        onFormSubmit();
        itemCodeRef.current?.focus();
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

  const handleConfirm = (values, resetForm) => {
    setTempValues({ values, resetForm });
    setVisible(true);
  };

  const accept = () => {
    if (tempValues) {
      handleFormSubmit(tempValues.values, tempValues.resetForm);
    }
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
        padding: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        gap: "27px",
      }}
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
        message="Are you sure you want to submit the form?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
      />

      <Formik
        initialValues={{
          itemCode: "",
          itemName: "",
          category: "",
          quantity: "",
          rate: "",
          location: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => handleConfirm(values, resetForm)}
      >
        {({ values, handleChange }) => (
          <Form>
            <TextField
              inputRef={itemCodeRef}
              label="Item Code"
              name="itemCode"
              value={values.itemCode}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <ErrorMessage
              name="itemCode"
              component="div"
              style={{ color: "red" }}
            />

            <TextField
              label="Item Name"
              name="itemName"
              value={values.itemName}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <ErrorMessage
              name="itemName"
              component="div"
              style={{ color: "red" }}
            />

            <FormControl margin="normal" fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={values.category}
                onChange={handleChange}
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Grocery">Grocery</MenuItem>
              </Select>
            </FormControl>
            <ErrorMessage
              name="category"
              component="div"
              style={{ color: "red" }}
            />

            <TextField
              label="Quantity"
              name="quantity"
              value={values.quantity}
              onChange={handleChange}
              type="number"
              margin="normal"
              fullWidth
            />
            <ErrorMessage
              name="quantity"
              component="div"
              style={{ color: "red" }}
            />

            <TextField
              label="Rate"
              name="rate"
              value={values.rate}
              onChange={handleChange}
              type="number"
              margin="normal"
              fullWidth
            />
            <ErrorMessage
              name="rate"
              component="div"
              style={{ color: "red" }}
            />

            <TextField
              label="Location"
              name="location"
              value={values.location}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <ErrorMessage
              name="location"
              component="div"
              style={{ color: "red" }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
              fullWidth
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default FormikForm;
