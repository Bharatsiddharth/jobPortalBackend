const express = require("express");
const { registerCompany, loginCompany, verifyEmail } = require("../controllers/companyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;