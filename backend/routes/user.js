const express = require("express");
const router = express.Router();
const {
  initializeDB,
  listTransactions,
  getStatistics,
  getPieChartData,
  getBarChartData,
} = require("../controllers/product");

router.get("/initialize", initializeDB);
router.get("/transactions", listTransactions);
router.get("/statistics", getStatistics);
router.get("/pie-chart", getPieChartData);
router.get("/bar-chart", getBarChartData);

module.exports = router;
