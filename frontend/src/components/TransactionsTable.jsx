import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionsTable = ({ month, onMonthChange }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    fetchTransactions();
  }, [month, search]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/products/transactions",
        {
          params: { month, search },
        }
      );
      setTransactions(response.data); // Update transactions array
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Calculate the data to display on the current page
  const startIndex = (page - 1) * perPage;
  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + perPage
  );

  const totalPages = Math.ceil(transactions.length / perPage);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <label className="mr-2 text-lg font-semibold">Select Month:</label>
          <select
            className="border border-gray-300 rounded-md p-2"
            value={month}
            onChange={onMonthChange}
          >
            {[
              "01",
              "02",
              "03",
              "04",
              "05",
              "06",
              "07",
              "08",
              "09",
              "10",
              "11",
              "12",
            ].map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          className="border border-gray-300 rounded-md p-2"
          placeholder="Search transactions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Sold</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((transaction, index) => (
            <tr key={transaction._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
              <td className="py-2 px-4 border-b">{transaction.title}</td>
              <td className="py-2 px-4 border-b">{transaction.description}</td>
              <td className="py-2 px-4 border-b">${transaction.price}</td>
              <td className="py-2 px-4 border-b">{transaction.category}</td>
              <td className="py-2 px-4 border-b">
                {transaction.sold ? "Yes" : "No"}
              </td>
              <td className="border-b">
                <img
                  src={transaction.image}
                  alt={transaction.title}
                  className="h-12 w-12 object-cover rounded"
                />
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(transaction.dateOfSale).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-md border ${
            page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-md border ${
            page >= totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
