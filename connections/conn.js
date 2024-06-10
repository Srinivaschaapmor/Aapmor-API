require("dotenv").config();

const { MongoClient } = require("mongodb");
// const client = new MongoClient(`mongodb+srv://chsrinivas4a:${process.env.DB_PASSWORD}@cluster0.mzzwimz.mongodb.net/Aapmor360?retryWrites=true&w=majority&appName=Cluster0`);
const client = new MongoClient(
  `mongodb+srv://aapmor360:aapmor360@aapmor360.axrpjra.mongodb.net/Aapmor360?retryWrites=true&w=majority&appName=Aapmor360`
);

const database = "Aapmor360";
// const collection = "employee_details";

const connection = client.db(database);
// collection(collection)

exports.connection = connection;
