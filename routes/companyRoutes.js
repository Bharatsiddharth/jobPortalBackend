const express = require("express");
const { registerCompany, loginCompany, verifyEmail } = require("../controllers/companyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register",  registerCompany);
router.post("/login", authMiddleware, loginCompany);
router.get("/verify-email/:token", authMiddleware, verifyEmail);

module.exports = router;