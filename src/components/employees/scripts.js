const { connection } = require("../../../connections/conn");
const {
  employeeModel,
  recruitmentModel,
  getFeedbackModel,
} = require("../../../connections/schema");
require("dotenv").config();

//script to insert data

const insertOneScript = async (collectionName, jsonData) => {
  const data = await connection.collection(collectionName).insertOne(jsonData);
  try {
    return data;
  } catch (err) {
    return err;
  }
};
//script to find data by id

const findOneScript = async (collectionName, query = {}, project = {}) => {
  try {
    return await connection.collection(collectionName).findOne(query, project);
  } catch (err) {
    return err;
  }
};

const findOneAndUpdateScript = async (
  collectionName,
  query = {},
  update = {},
  upsert = {},
  options = {}
) => {
  const data = await connection
    .collection(collectionName)
    .findOneAndUpdate(query, update, upsert, options);
  try {
    return data;
  } catch (err) {
    return err;
  }
};

//script to find all data

const employeeFindScript = async (query = {}, project = {}, sort = {}) => {
  const data = await employeeModel.find(query, project).sort(sort);
  try {
    return data;
  } catch (err) {
    return err;
  }
};

const feedbackScript = async (query = {}, project = {}, sort = {}) => {
  const data = await getFeedbackModel.find(query, project).sort(sort);
  try {
    return data;
  } catch (err) {
    return err;
  }
};

const recruitmentFindScript = async (query = {}, project = {}, sort = {}) => {
  const data = await recruitmentModel.find(query, project).sort(sort);
  try {
    return data;
  } catch (err) {
    return err;
  }
};

const updateOneScript = async (
  collectionName,
  query = {},
  update = {},
  options = {}
) => {
  const data = await connection
    .collection(collectionName)
    .updateOne(query, update, options);
  try {
    return data;
  } catch (err) {
    return err;
  }
};

module.exports = {
  findOneAndUpdateScript,
  insertOneScript,
  findOneScript,
  recruitmentFindScript,
  employeeFindScript,
  feedbackScript,
  updateOneScript,
};
