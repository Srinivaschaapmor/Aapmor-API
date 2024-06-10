const mongoose = require("mongoose");

// {
//   "_id": {
//     "$oid": "66333994a5d950e2c54affd6"
//   },
//
// ----------------------------------------------
//   "employeeId": "E0006",
//   "fullName": "Praveen",
//   "gender": "Male",
//   "email": "praveensai18@gmail.com",
//   "address": "hyderabad",
//   "department": "Fullstack",
//   "bloodGroup": "O+",
//   "dateOfBirth": "",
//   "manager": "Tirupathi"
//   "workLocation": "Hyderabad",
//   "profileImage": "https://example.com/praveen_avatar.jpg",
//   "phoneNumber": "",
//   "maritalStatus": "Unmarried",
//   "laptopSerialNo": "dell123",
//   "laptopName": "Dell",
//   "jobTitle": "SDE-1",
//   "employeeEmail": "praveensaik@aapmor.com",
//   "dateOfHire": "",

// }

const employeeDetailsSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      // required: true,
    },
    department: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      // required: true,
    },
    dateOfBirth: {
      type: String,
    },
    manager: {
      type: String,
      // required: true,
    },
    workLocation: {
      type: String,
      // required: true,
    },
    profileImage: {
      type: String,
    },
    phoneNumber: {
      type: String,
      // required: true,
    },
    maritalStatus: {
      type: String,
      // required: true,
    },
    laptopSerialNo: {
      type: String,
      // required: true,
    },
    laptopName: {
      type: String,
      // required: true,
    },
    jobTitle: {
      type: String,
      // required: true,
    },
    employeeEmail: {
      type: String,
      // required: true,
    },
    dateOfHire: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmployeeDetails =
  mongoose.models.EmployeeDetails ||
  mongoose.model("EmployeeDetails", employeeDetailsSchema);
module.exports = EmployeeDetails;
