const express = require("express");

const {
  createMasterData,
  getMasterData,
} = require("../controllers/masterDataController");

const router = express.Router();

router.post("/", createMasterData);
router.get("/", getMasterData);

module.exports = router;
