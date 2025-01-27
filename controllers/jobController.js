const Job = require("../models/Job");
const sendEmail = require("../utils/SendEmail");

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find(); // Retrieve all jobs from the database
    if (!jobs.length) return res.status(404).json({ message: "No jobs found." });

    res.status(200).json(jobs); // Respond with the list of jobs
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.postJob = async (req, res) => {
  try {
    const { title, description, experienceLevel, endDate, candidateEmails } = req.body; // Change candidates to candidateEmails
    const job = new Job({
      title,
      description,
      experienceLevel,
      endDate,
      candidateEmails, // Store the candidate emails directly
    });

    await job.save();
    res.status(201).json({ message: "Job posted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.sendJobEmails = async (req, res) => {
  try {
    const { jobId } = req.body; // Get jobId from the request body
    const job = await Job.findById(jobId); // Find the job by ID

    if (!job) return res.status(404).json({ message: "Job not found." });

    // Extract emails from the job
    const emails = job.candidateEmails;

    // Log the job and emails for debugging
    console.log("Job:", job);
    console.log("Emails:", emails);

    // Check if emails array is empty
    if (emails.length === 0) {
      return res.status(400).json({ message: "No candidate emails found." });
    }

    // Send emails to each candidate
    for (const email of emails) {
      await sendEmail(
        email,
        "Job Opportunity",
        `Check out this job: ${job.title}\nDescription: ${job.description}\nApply before: ${job.endDate}`
      );
    }

    res.json({ message: "Emails sent successfully." });
  } catch (error) {
    console.error("Error sending emails:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error." });
  }
};
