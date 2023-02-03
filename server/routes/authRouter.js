const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const {
	handleSignUp,
	handleLogin,
	SignInAttempt,
} = require("../controllers/authController");
const { rateLimiter } = require("../controllers/rateLimiter");

router.post("/signup", validateForm,  handleSignUp);

router
	.route("/login")
	.get(handleLogin)
	.post(validateForm, SignInAttempt);

module.exports = router;
