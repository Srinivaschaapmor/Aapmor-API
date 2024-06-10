const {
  create,
  get,
  getCandidateDetails,
} = require("../services/scheduleInterviewService");

const createInterviewSchedule = async (req, res) => {
  try {
    const interviewScheduleDetails = await create(req.body);
    res.status(201).json(interviewScheduleDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getInterviewSchedule = async (req, res) => {
  try {
    const interviewScheduleDetails = await get();
    res.status(200).json(interviewScheduleDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getCandidateInfo = async (req, res) => {
  try {
    const interviewEmail = req.query.interviewer;
    const candidateId = req.query.id;

    if (!interviewEmail && !candidateId) {
      return res.status(400).json({
        message: "Either interviewer email or candidate ID is required",
      });
    }

    let candidateInfo;

    if (interviewEmail) {
      candidateInfo = await getCandidateDetails(interviewEmail);
    } else {
      candidateInfo = await getCandidateDetails(null, candidateId);
    }

    res.status(200).json(candidateInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createInterviewSchedule,
  getInterviewSchedule,
  getCandidateInfo,
};
