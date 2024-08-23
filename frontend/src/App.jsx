import React, { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import "./App.css";

function App() {
  const [month, setMonth] = useState("03"); // Default to March

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div>
      <h1 className="text-center text-3xl p-2">Transaction Dashboard</h1>
      <TransactionsTable month={month} onMonthChange={handleMonthChange} />

      <Statistics month={month} />

      <BarChart month={month} />
    </div>
  );
}

export default App;
