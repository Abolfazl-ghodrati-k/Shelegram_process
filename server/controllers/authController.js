const pool = require("../db");
const bcrypt = require("bcrypt");
const { jwtSign, jwtVerify, getJwt } = require("./jwt/jwtAuth");
const { v4: uuidV4 } = require("uuid");

module.exports.handleLogin = async (req, res) => {
	const token = getJwt(req);
	if (!token) {
		res.json({ loggedIn: false, message: "send Token!" });
		return;
	}

	jwtVerify(token)
		.then((decoded) => {
			const username = decoded.username;
			res.json({ loggedIn: true, token: token, username });
			return;
		})
		.catch((err) => {
			res.json({
				loggedIn: false,
				message: "Error occured please login again",
			});
			return;
		});
};

module.exports.handleSignUp = async (req, res) => {
	const exsitingUser = await pool.query(
		"SELECT username from users WHERE username=$1",
		[req.body.username]
	);
	if (exsitingUser.rowCount == 0) {
		const hashedPass = await bcrypt.hash(req.body.password, 10);
		const newUserQuery = await pool.query(
			"INSERT INTO users(username, passhash, userId) values($1,$2,$3) RETURNING id, userId",
			[req.body.username, hashedPass, uuidV4()]
		);
		const username = req.body.username;
		jwtSign(
			{
				username: req.body.username,
				id: newUserQuery.rows[0].id,
				userId: newUserQuery.rows[0].userid,
			},
			{ expiresIn: "1year" }
		)
			.then((token) => {
				res.json({
					loggedIn: true,
					token,
					username,
				});
				return;
			})
			.catch((err) => {
				res.json({ loggedIn: false, message: " try again later ..." });
				return;
			});
	} else {
		res.json({ loggedIn: false, message: "Username taken" });
		return;
	}
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
			const username = req.body.username;

			jwtSign(
				{
					username: req.body.username,
					id: potentialLogin.rows[0].id,
					userId: potentialLogin.rows[0].userid,
				},
				{ expiresIn: "1year" }
			)
				.then((token) => {
					res.json({ loggedIn: true, token, username });
					return;
				})
				.catch((err) => {
					res.json({
						loggedIn: false,
						message: " try again later ...",
					});
					return;
				});
			1;
		} else {
			res.json({
				loggedIn: false,
				message: "Wrong username or password",
			});
			return;
		}
	} else {
		res.json({
			loggedIn: false,
			message: "Wrong username or password",
		});
		return;
	}
};
