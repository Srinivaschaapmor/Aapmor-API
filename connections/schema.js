const mongoose = require("mongoose");
const Schema = new mongoose.Schema({});
const getRequiredModel = (collection) => {
  return mongoose.model(collection, Schema);
};
const employeeModel = mongoose.model("employee_details", Schema);
const recruitmentModel = mongoose.model("recruitment_details", Schema);
// exports.employeeModel = employeeModel;
// exports.recruitmentModel = recruitmentModel;
exports.getRequiredModel = getRequiredModel;
const getFeedbackModel = mongoose.model("feedback_details", Schema);
const EmailModel = mongoose.model("users", Schema);
exports.getFeedbackModel = getFeedbackModel;
exports.employeeModel = employeeModel;
exports.recruitmentModel = recruitmentModel;
exports.EmailModel = EmailModel;
