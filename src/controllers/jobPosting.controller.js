import JobPosting from "../models/JobPosting.model.js";

// GET all job postings
export const getAllJobPostings = async (req, res) => {
  try {
    // Filter by creatorId matching the logged-in user
    const jobs = await JobPosting
    .find({ creatorId: req.user.id }).sort({ createdAt: -1 })
    .populate("creatorId", "name email");

    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch job postings" });
  }
};

// export const getAllJobPostings = async (req, res) => {
//   try {
//     const jobs = await JobPosting.find().sort({ createdAt: -1 });
//     // we have creatorId have to filter this using req.user.id
//     res.status(200).json(jobs);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch job postings" });
//   }
// };

// POST create a new job posting
export const createJobPosting = async (req, res) => {
  try {
    const newJob = new JobPosting(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(400).json({ error: "Failed to create job posting", details: err });
  }
};
