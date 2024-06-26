require("dotenv").config();

const router = require("express").Router();

const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { getRedis } = require("../../../../databases/redis");

router.post("/", async (req, res) => {
	if (!req.headers.eglo_auth) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	const verified = await jwt.verify(req.headers.eglo_auth, process.env.SERVER_TOKEN_SECRET);

	const redis = await getRedis();

	const clipboard_data = await redis.get(`clipboard.${verified.user_id}`);

	res.status(200).json(JSON.parse(clipboard_data));
});

module.exports = router;
