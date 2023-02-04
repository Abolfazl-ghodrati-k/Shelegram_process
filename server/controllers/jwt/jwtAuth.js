const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const jwtSign = (payload, options) =>
	new Promise((resolve, reject) => {
		jwt.sign(payload, secret, options, (err, token) => {
			if (err) {
				reject(err);
			}
			resolve(token);
		});
	});

const jwtVerify = (token) =>
	new Promise(( resolve, reject ) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(decoded);
			}
		});
	});

const getJwt = (req) => {
	return req.headers["authorization"].split(" ")[1];
};

module.exports = { jwtSign, jwtVerify, getJwt };
