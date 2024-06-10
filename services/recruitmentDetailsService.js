const RecruitmentDetails = require("../models/recruitmentDetailsModel");
const JobApplicant = require("../models/jobApplicantModel");
const JobPosting = require("../models/jobPostingModel");
const mongoose = require("mongoose");

// CREATE a recruitment applicant
const create = async (applicantDetails) => {
  try {
    // check if job posting id is valid
    const job = await JobPosting.findById(applicantDetails.jobPostingId);

    if (!job) {
      return "invalid job";
    }

    //check if applicant id is valid
    const applicant = await JobApplicant.findById(
      applicantDetails.jobApplicantId
    );
    if (!applicant) {
      return "invalid applicant";
    }

    const recruitmentDetails = await RecruitmentDetails.create(
      applicantDetails
    );
    return recruitmentDetails;
  } catch (error) {
    console.error("Error creating data:", error);
    throw new Error("Error creating data");
  }
};

const getAll = () => {
  try {
    const recruitmentDetails = RecruitmentDetails.find();
    return recruitmentDetails;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

// const getOne = async (id) => {
//   const ApplicantId = new mongoose.Types.ObjectId(id);
//   try {
//     const particularApplicantDesc = await RecruitmentDetails.findById(
//       ApplicantId
//     );
//     return particularApplicantDesc;
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };
const getOne = async (id) => {
  const userIdList = id
    .split(",")
    .map((eachId) => new mongoose.Types.ObjectId(eachId));
  try {
    const applicantsDetails = await RecruitmentDetails.aggregate([
      { $match: { _id: { $in: userIdList } } },
      {
        $lookup: {
          from: "JobPosting", // Replace with actual collection name if needed
          localField: "jobPostingId",
          foreignField: "_id",
          as: "jobPostingDetails",
        },
      },
      {
        $lookup: {
          from: "JobApplicant", // Replace with actual collection name if needed
          localField: "jobApplicantId",
          foreignField: "_id",
          as: "jobApplicantDetails",
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          email: 1,
          source: 1,
          role: 1,
          resume: 1,
          gender: 1,
          education: 1,
          experience: 1,
          technicalSkills: 1,
          interviewRounds: 1,
          jobPostingDetails: 1,
          jobApplicantDetails: 1,
        },
      },
    ]);

    return applicantsDetails;
  } catch (error) {
    console.error("Error:", error);
    throw new Error(error.message);
  }
};

const getOneCandidateDetails = async (id) => {
  const ApplicantId = new mongoose.Types.ObjectId(id);
  try {
    const particularApplicantDesc = await RecruitmentDetails.findById(
      ApplicantId
    );
    if (!particularApplicantDesc) {
      throw new Error("Candidate not found");
    }
    return particularApplicantDesc;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const updateApplicantDesc = async (id, applicantDetails) => {
  const applicantId = new mongoose.Types.ObjectId(id);

  try {
    const existingApplicantDetails = await RecruitmentDetails.findById(
      applicantId
    );

    if (!existingApplicantDetails) {
      return null; // If applicant details not found, return null
    }

    // Check if there's existing feedback for the interview type
    const existingFeedbackIndex =
      existingApplicantDetails.interviewRounds.findIndex(
        (round) =>
          round.interviewType === applicantDetails.recruitFeedback.interviewType
      );

    // // If feedback exists for the same interview type, update it, otherwise push new feedback
    if (existingFeedbackIndex !== -1) {
      // Update existing feedback
      existingApplicantDetails.interviewRounds[existingFeedbackIndex] =
        applicantDetails.recruitFeedback;
    } else {
      // Push new feedback
      existingApplicantDetails.interviewRounds.push(
        applicantDetails.recruitFeedback
      );
    }

    // // Save the updated applicant details
    const updatedApplicantDetails = await existingApplicantDetails.save();

    return updatedApplicantDetails; // Return the updated applicant details
  } catch (error) {
    console.error("Error updating data:", error);
    throw new Error("Error updating data");
  }
};

module.exports = {
  create,
  getOne,
  getAll,
  updateApplicantDesc,
  getOneCandidateDetails,
};
