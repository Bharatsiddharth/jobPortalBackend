const express = require("express");
const { postJob, sendJobEmails, getAllJobs } = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/alljobs", getAllJobs); 
router.post("/post", authMiddleware, postJob);
router.post("/send-emails", authMiddleware, sendJobEmails);

module.exports = router;