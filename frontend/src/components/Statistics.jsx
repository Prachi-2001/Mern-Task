import React, { useEffect, useState } from "react";
import axios from "axios";

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/products/statistics`,
        {
          params: { month },
        }
      );
      setStatistics({
        totalSaleAmount: response.data.totalSaleAmount,
        totalSoldItems: response.data.soldItems,
        totalNotSoldItems: response.data.notSoldItems,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const getMonthName = (monthNumber) => {
    const date = new Date(2024, monthNumber - 1);
    return date.toLocaleString("default", { month: "long" });
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg ">
      <h2 className="text-2xl font-semibold mb-4">
        Statistics - {getMonthName(parseInt(month, 10))}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium ">
            Total Sale Amount - ${statistics.totalSaleAmount.toFixed(2)}
          </h3>
          <h3 className="text-lg font-medium ">
            Total Sold Items - {statistics.totalSoldItems}
          </h3>
          <h3 className="text-lg font-medium ">
            Total Not Sold Items - {statistics.totalNotSoldItems}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
