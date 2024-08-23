import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ month }) => {
  const [barData, setBarData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchBarData();
  }, [month]);

  const fetchBarData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/products/bar-chart`,
        {
          params: { month },
        }
      );

      const labels = Object.keys(response.data); // Get the range labels
      const data = Object.values(response.data); // Get the count values

      setBarData({
        labels,
        datasets: [
          {
            label: "Number of Items",
            data,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  const getMonthName = (monthNumber) => {
    const date = new Date(2024, monthNumber - 1);
    return date.toLocaleString("default", { month: "long" });
  };
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 p-6">
        Bar Chart Stat - {getMonthName(parseInt(month, 10))}
      </h2>
      <Bar data={barData} className="p-6" />
    </>
  );
};

export default BarChart;
