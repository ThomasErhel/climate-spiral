import React, { useState } from "react";
import "./App.css";
import ClimateSpiral from "./ClimateSpiral";

function App() {
  const [uniqueKey] = useState(Date.now());

  return (
    <div className="App">
      <header className="App-header">
        <ClimateSpiral
          dataUrl="giss-data-apr-11-2023.csv"
          key={`climate-spiral-${uniqueKey}`}
        />
      </header>
    </div>
  );
}

export default App;
