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
    <div style={{ padding: "0px 25px" }}>
      <h1
        style={{
          backgroundColor: "#f0f0f1",
          color: "black",
          fontFamily: "serif",
          fontSize: "50px",
          textAlign: "center",
        }}
      >
        Retail Dady
      </h1>
     
    </div>
     <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <InvoiceForm onFormSubmit={triggerRefresh} />
        <Tables refresh={refresh} />
      </div>
      </>
  );
}

export default App;