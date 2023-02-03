const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidV4 } = require("uuid");
const jwt = require("bcrypt");
const { jwtSign, jwtVerify, getJwt } = require("./jwt/jwtAuth");

module.exports.handleLogin = async (req, res) => {
	const token = getJwt(req);
	if(token){
		res.json({loggedIn:false, message: "send Token!"})
	}
	jwtVerify(token)
		.catch((err) => res.json({ loggedIn: false, message: err }))
		.then((decoded) => res.json({ loggedIn: true, token: decoded }));
};

module.exports.handleSignUp = async (req, res) => {
	const exsitingUser = await pool.query(
		"SELECT username from users WHERE username=$1",
		[req.body.username]
		);
		res.json({res:exsitingUser})
	// if (exsitingUser.rowCount == 0) {
	// 	const hashedPass = await bcrypt.hash(req.body.password, 10);
	// 	const newUserQuery = await pool.query(
	// 		"INSERT INTO users(username, passhash, userId) values($1,$2,$3) RETURNING id, userId",
	// 		[req.body.username, hashedPass, uuidV4()]
	// 	);
	// 	jwtSign(
	// 		{
	// 			username: req.body.username,
	// 			id: newUserQuery.rows[0].id,
	// 			userId: newUserQuery.rows[0].id,
	// 		},
	// 		"dfdfbg455678678",
	// 		{ expiresIn: "1min" }
	// 	)
	// 		.then((token) => res.json({ loggedIn: true, token }))
	// 		.catch((err) =>
	// 			res.json({ loggedIn: false, message: " try again later ..." })
	// 		);
	// } else {
	// 	res.json({ loggedIn: false, status: "Username taken" });
	// }
};

module.exports.SignInAttempt = async (req, res) => {
	const potentialLogin = await pool.query(
		"SELECT id, username, passhash, userId FROM users u WHERE u.username=$1",
		[req.body.username]
	);
	// console.log(potentialLogin)
	if (potentialLogin.rowCount != 0) {
		const isSamePass = await bcrypt.compare(
			req.body.password,
			potentialLogin.rows[0].passhash
		);
		if (isSamePass) {
			jwtSign(
				{
					username: req.body.username,
					id: newUserQuery.rows[0].id,
					userId: newUserQuery.rows[0].id,
				},
				"dfdfbg455678678",
				{ expiresIn: "1min" }
			)
				.then((token) => res.json({ loggedIn: true, token }))
				.catch((err) =>
					res.json({
						loggedIn: false,
						message: " try again later ...",
					})
				);
			1;
		} else {
			res.json({ loggedIn: false, message: "Wrong  password" });
		}
	} else {
		console.log("not good");
		res.json({
			loggedIn: false,
			message: "Wrong username or password",
		});
	}
};
