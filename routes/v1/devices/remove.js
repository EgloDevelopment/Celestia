require("dotenv").config();

const router = require("express").Router();

const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { getMongo } = require("../../../databases/mongo");

const Schema = z.object({
	device_id: z.string().uuid(),
});

router.post("/", async (req, res) => {
	if (!req.headers.eglo_auth) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	try {
		Schema.parse(req.body);
	} catch (e) {
		res.status(400).json(e.issues);
		return;
	}

	const verified = await jwt.verify(req.headers.eglo_auth, process.env.SERVER_TOKEN_SECRET);

	const mongo = await getMongo();

	await mongo.db("Eglo").collection("Devices").deleteOne({
		id: req.body.device_id,
		owner_id: verified.user_id,
	});

	res.status(200).json({ message: "Device was removed" });
});

module.exports = router;
