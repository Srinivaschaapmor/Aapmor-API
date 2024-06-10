const { create, getAll } = require("../services/masterDataService");

const createMasterData = async (req, res) => {
  let { category, name } = await req.body;

  try {
    const masterData = await create(req.body);
    res.status(201).json(masterData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all JobApplicants
const getMasterData = async (req, res) => {
  try {
    const masterData = await getAll();
    res.status(200).json(masterData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMasterData,
  getMasterData,
};
