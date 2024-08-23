const axios = require("axios");
const Product = require("../models/product");

const initializeDB = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const products = response.data;
    await Product.deleteMany();
    await Product.insertMany(products); // Seed new data

    res.status(200).json({ message: "Database initialized with seed data" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listTransactions = async (req, res) => {
  try {
    const { search, month } = req.query;

    // Validate the month parameter
    if (!month || !/^\d{2}$/.test(month)) {
      return res.status(400).json({ error: "Invalid month parameter" });
    }

    // Build the query to filter by month
    const query = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, parseInt(month, 10)],
      },
    };

    // Handle text search on 'title' and 'description' fields
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search on title
        { description: { $regex: search, $options: "i" } }, // Case-insensitive search on description
      ];
    }

    // Execute the query
    const transactions = await Product.find(query);

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    const transactions = await Product.aggregate([
      {
        $addFields: {
          month: { $month: "$dateOfSale" }, // Extract month from the date
        },
      },
      {
        $match: {
          month: parseInt(month, 10), // Match the extracted month with the input
        },
      },
    ]);

    const totalSaleAmount = transactions.reduce(
      (acc, product) => acc + product.price,
      0
    );
    const soldItems = transactions.filter((product) => product.sold).length;
    const notSoldItems = transactions.filter((product) => !product.sold).length;

    res.status(200).json({ totalSaleAmount, soldItems, notSoldItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = parseInt(month, 10); // Convert month to number

    const transactions = await Product.aggregate([
      {
        $addFields: {
          month: { $month: "$dateOfSale" }, // Extract month from the date
        },
      },
      {
        $match: {
          month: monthNumber, // Match transactions with the selected month
        },
      },
    ]);

    const priceRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    transactions.forEach((product) => {
      if (product.price <= 100) priceRanges["0-100"]++;
      else if (product.price <= 200) priceRanges["101-200"]++;
      else if (product.price <= 300) priceRanges["201-300"]++;
      else if (product.price <= 400) priceRanges["301-400"]++;
      else if (product.price <= 500) priceRanges["401-500"]++;
      else if (product.price <= 600) priceRanges["501-600"]++;
      else if (product.price <= 700) priceRanges["601-700"]++;
      else if (product.price <= 800) priceRanges["701-800"]++;
      else if (product.price <= 900) priceRanges["801-900"]++;
      else priceRanges["901-above"]++;
    });

    res.status(200).json(priceRanges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = parseInt(month, 10); // Convert month to number

    const transactions = await Product.aggregate([
      {
        $addFields: {
          month: { $month: "$dateOfSale" }, // Extract month from the date
        },
      },
      {
        $match: {
          month: monthNumber, // Match transactions with the selected month
        },
      },
      {
        $group: {
          _id: "$category", // Group by category
          count: { $sum: 1 }, // Count the number of products in each category
        },
      },
    ]);

    const categoryCounts = transactions.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json(categoryCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  listTransactions,
  initializeDB,
  getStatistics,
  getBarChartData,
  getPieChartData,
};
