const mongoose = require("mongoose");

const masterDataSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const MasterData =
  mongoose.models.MasterData || mongoose.model("MasterData", masterDataSchema);

module.exports = MasterData;
