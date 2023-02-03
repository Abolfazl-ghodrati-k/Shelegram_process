const Yup = require("yup");

const formSchema = Yup.object({
	username: Yup.string()
		.required("username required")
		.min(6, "username too short")
		.max(28, "username too long"),
	password: Yup.string()
		.required("password required")
		.min(6, "password too short")
		.max(28, "password too long"),
});

const validateForm = (req, res, next) => {
	const formData = req.body;
	// res.json(formData)
	formSchema
		.validate(formData)
		.catch((err) => {
			res.json({loggedIn: false, message: err})
		})
		.then((valid) => {
			if (valid) {
				next()
			}
		});
};

module.exports = validateForm;
