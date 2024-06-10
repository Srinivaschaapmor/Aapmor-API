const MasterData = require("../models/masterDataModel");
const mongoose = require("mongoose");

// CREATE a JobPosting
const create = async (data) => {
  try {
    const masterData = await MasterData.create(data);
    return masterData;
  } catch (error) {
    console.error("Error creating data:", error);
    throw new Error("Error creating data");
  }
};
const getAll = async () => {
  try {
    const masterData = await MasterData.find();
    return masterData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

module.exports = {
  create,
  getAll,
};
