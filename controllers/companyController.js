const Company = require("../models/Company");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/SendEmail");

exports.registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required." });

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) return res.status(400).json({ message: "Company already exists." });

    const newCompany = new Company({ name, email, password });
    await newCompany.save();

    const token = jwt.sign({ id: newCompany._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    await sendEmail(email, "Verify Your Email", `Click this link to verify: ${process.env.FRONTEND_URL}/verify-email/${token}`);

    res.status(201).json({ message: "Company registered. Please check your email for verification." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "All fields are required." });
    }

    const company = await Company.findOne({ email });
    if (!company) {
      console.log("Company not found");
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials." });
    }

    if (!company.isVerified) {
      console.log("Company email not verified");
      return res.status(400).json({ message: "Please verify your email first." });
    }

    // Generate the token
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    // Include the token in the JSON response
    res.json({ token, message: "Logged in successfully." });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error." });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const companyId = decoded.id;

    // Find and update the company
    const company = await Company.findByIdAndUpdate(
        companyId,
        { isVerified: true },
        { new: true }
    );

    if (!company) {
        return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Email verified successfully!' });
} catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
}
};

