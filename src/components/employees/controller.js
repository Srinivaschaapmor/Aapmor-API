//Business Logic
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  insertOneScript,
  findOneScript,
  recruitmentFindScript,
  employeeFindScript,
  updateOneScript,
  findOneAndUpdateScript,
  feedbackScript,
} = require("./scripts");
const responseCodes = require("../../../constants");
const { getRequiredModel } = require("../../../connections/schema");
require("dotenv").config();

const employeeCollection = process.env.EMPLOYEE_COLLECTION;
const quoteCollection = process.env.QUOTES_COLLECTION;
const feedbackCollection = process.env.FEEDBACK_COLLECTION;
const usersCollection = process.env.USERS_COLLECTION;
const blogsCollection = process.env.BLOGS_COLLECTION;

const postLoginDetails = async (request, response) => {
  const { email, otp } = request.body;
  await findOneScript(usersCollection, { email: email })
    .then(async (resObj) => {
      const otpMatched = await bcrypt.compare(otp, resObj.otp);
      if (otpMatched) {
        const payload = {
          email: email,
        };
        const jwt_token = jwt.sign(payload, "ABPPBH_ST");
        response.status(200).json({ jwt_token, email });
      } else {
        response.status(202);
        response.json({ message: "Invalid Otp" });
      }
    })
    .catch((error) => {
      response
        .status(responseCodes.SERVER_ERROR)
        .json({ flag: "error", error: error });
    });
};

const createBlog = async (request, response) => {
  await insertOneScript(blogsCollection, request.body)
    .then((res) => {
      response.status(responseCodes.SUCCESS);
      response.json({ message: res.insertedId });
    })
    .catch((error) => {
      response
        .status(responseCodes.SERVER_ERROR)
        .json({ flag: "error", error });
    });
};

const getAllBlogsByFilter = async (request, response) => {
  const { category = "All" } = request.query;
  if (category === "All") {
    var query = await getRequiredModel(blogsCollection)
      .find({})
      .sort({ date: 1 });
  } else {
    var query = await getRequiredModel(blogsCollection)
      .find({ category: category })
      .sort({ date: 1 });
  }
  const blogsByCategory = await query;
  try {
    response.send(blogsByCategory);
  } catch (error) {
    response.send(error);
  }
};

const getBlogById = async (request, response) => {
  const blogId = request.params.id;
  if (!ObjectId.isValid(blogId)) {
    return response.status(400).send("Invalid blogId");
  }
  await findOneScript(blogsCollection, { _id: new ObjectId(blogId) })
    .then((res) => response.send(res))
    .catch((err) => console.log(err));
};

const postComments = async (request, response) => {
  const { comment, id, name, dateObject } = request.body;
  console.log(request.body);
  await findOneAndUpdateScript(
    blogsCollection,
    { _id: new ObjectId(id) },
    { $push: { comments: { comment, name, dateObject } } },
    { $upsert: true },
    { new: true }
  )
    .then((res) => {
      console.log(res, "RESPONSE AFTER COMMENT");
      response.status(200).json({ message: "new comment added" });
    })
    .catch((err) => {
      console.log("error", err);
      response.send(err);
    });
};

const updateLikes = async (request, response) => {
  const { id } = request.body;
  await findOneAndUpdateScript(
    blogsCollection,
    { _id: new ObjectId(id) },
    { $inc: { likes: 1 } }
  )
    .then((res) => {
      response.send(res);
    })
    .catch((err) => response.send(err));
};

const saveBlog = async (request, response) => {
  const { _id } = request.body;
  const { email } = request;
  console.log(email);

  await findOneAndUpdateScript(
    blogsCollection,
    { _id: new ObjectId(_id) },
    { $push: { savedUsers: email } },
    { $upsert: true },
    { new: true }
  )
    .then((res) => {
      response.status(200).send(res);
    })
    .catch((err) => response.send(err));
};

const unSaveBlog = async (request, response) => {
  const { _id } = request.body;
  const { email } = request;

  await findOneAndUpdateScript(
    blogsCollection,
    { _id: new ObjectId(_id) },
    { $pull: { savedUsers: email } }
  )
    .then((res) => {
      response.status(200).send(res);
    })
    .catch((err) => response.send(err));
};

const getUserSavedBlogs = async (request, response) => {
  const { email } = request;
  const savedBlogsArray = await getRequiredModel(blogsCollection).find({});
  let blogs = [];
  savedBlogsArray.findIndex((each, index) => {
    if (each._doc.savedUsers.includes(email)) {
      blogs.push(savedBlogsArray[index]);
    }
  });
  response.status(200).send(blogs);
};

const createEmployee = async (req, res) => {
  // const {fullName,dateOfBirth,employeeId,employeeEmail,gender,address,phoneNumber,email,maritalStatus,jobTitle,dateOfHire,department,workLocation,manager,bloodGroup,laptop,laptopSerialNo,userImage,emergencyDetails}
  try {
    const data = await insertOneScript(employeeCollection, req.body);
    res.status(responseCodes.SUCCESS).json({ data });
  } catch (error) {
    console.log(error.message);
    res.status(responseCodes.SERVER_ERROR).json({ flag: "error" });
  }
};

const getEmployees = async (req, res) => {
  try {
    const data = await employeeFindScript();
    res.status(responseCodes.SUCCESS).json({ flag: "success", data });
  } catch (error) {
    console.log(error.message);
    res.status(responseCodes.SERVER_ERROR).json({ flag: "error" });
  }
};

const getEmpId = async (req, res) => {
  const employeeId = req.params.id;
  try {
    const data = await findOneScript(employeeCollection, {
      employeeId: employeeId,
    });
    console.log(data);
    res.status(200).json({ flag: "success", data });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ flag: "error" });
  }
};

const quoteGenerator = async (req, res) => {
  try {
    const quotesObj = await findOneScript(quoteCollection);
    const quotesArray = quotesObj.quotes; //retrieve quotes array from output obj, quotes is an obj key
    const quotesLength = quotesArray.length;
    const randomNumber = Math.random(0, 1) * quotesLength;
    quotesArray.map((eachQuote) => {
      if (eachQuote.id === parseInt(randomNumber)) {
        res.send([eachQuote.quote, eachQuote.author]);
      }
    });
  } catch (err) {
    res.send(err);
  }
};

const postRecruitmentDetails = async (req, res) => {
  try {
    const response = await insertOneScript("recruitment_details", req.body);
    res.status(responseCodes.SUCCESS).json({ flag: "success", response });
  } catch (err) {
    console.log(err);
    res.status(responseCodes.SERVER_ERROR).json({ flag: "error", err });
  }
};

const getRecruitmentDetailsById = async (req, res) => {
  const job_seeker_id = req.params.id;
  try {
    const response = await findOneScript("recruitment_details", {
      _id: new ObjectId(job_seeker_id),
    });
    res.status(responseCodes.SUCCESS).json({ flag: "success", response });
  } catch (err) {
    console.log(err);
    res.status(responseCodes.SERVER_ERROR).json({ flag: "error", err });
  }
};

const getRecruitmentDetails = async (req, res) => {
  try {
    const response = await recruitmentFindScript();
    res.status(responseCodes.SUCCESS).json({ flag: "success", response });
  } catch (err) {
    console.log(err);
    res.status(responseCodes.SERVER_ERROR).json({ flag: "error", err });
  }
};

const updateRecruitmentDetails = async (req, res) => {
  const job_seeker_id = req.params.id;
  const updateData = req.body;
  console.log(job_seeker_id);
  console.log(updateData);
  try {
    const response = await updateOneScript(
      "recruitment_details",
      {
        _id: new ObjectId(job_seeker_id),
      },
      { $push: { rounds: updateData } },
      { upsert: true }
    );
    res.status(responseCodes.SUCCESS).json({ flag: "success", response });
  } catch (err) {
    res.status(responseCodes.SERVER_ERROR).json({ flag: "error", err });
  }
};

const postFeedback = async (req, res) => {
  try {
    const data = await insertOneScript(feedbackCollection, req.body);
    res.status(responseCodes.SUCCESS).json({ data });
  } catch (error) {
    res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error });
  }
};

const getFeedback = async (req, res) => {
  try {
    const response = await feedbackScript();
    res.status(responseCodes.SUCCESS).json({ response });
  } catch (error) {
    res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error });
  }
};

module.exports = {
  getUserSavedBlogs,
  unSaveBlog,
  saveBlog,
  updateLikes,
  postComments,
  getBlogById,
  getAllBlogsByFilter,
  createBlog,
  postLoginDetails,
  getEmployees,
  createEmployee,
  getEmpId,
  postFeedback,
  getFeedback,
  quoteGenerator,
  postRecruitmentDetails,
  getRecruitmentDetails,
  getRecruitmentDetailsById,
  updateRecruitmentDetails,
};
