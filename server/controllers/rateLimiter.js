const redisClient = require("../redis");

module.exports.rateLimiter =
	(secondsLimit, limitAmount) => async (req, res, next) => {
		const ip =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		const response = await redisClient
			.multi()
			.incr(ip)
			.expire(secondsLimit)
			.exec();
		if (response[1] > limitAmount)
			res.json({
				loggedIn: false,
				message:
					"tu mara hamla mikuni kunkash? rmzi kiru mikhay? bia be khodam begu",
			});
		else {
			next();
		}
	};
