import { useState } from "react";
import Tables from "./components/Tables";
import "./App.css";
import InvoiceForm from "./components/Form";

function App() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <>
      <h1 style={{ backgroundColor: "grey", color: "blue", fontFamily:"serif" }}>Retail Dady</h1>
      <div style={{ display: "flex", flexDirection: "row", gap: "50px" }}>
        <InvoiceForm onFormSubmit={triggerRefresh} />
        <Tables refresh={refresh} />
      </div>
    </>
  );
}

export default App;
