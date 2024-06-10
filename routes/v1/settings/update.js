require("dotenv").config();

const router = require("express").Router();

const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { getMongo } = require("../../../databases/mongo");

const Schema = z.object({
	name: z.string().min(2).max(50).optional(),
	email: z.string().email().optional(),
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

	const original_user_data = await mongo.db("Eglo").collection("Users").findOne({ id: verified.user_id });

	await mongo
		.db("Eglo")
		.collection("Users")
		.updateOne(
			{ id: verified.user_id },
			{
				$set: {
					name: req.body.name || original_user_data.name,
					email: req.body.email || original_user_data.email,
				},
			}
		);

	res.status(200).json({ message: "Updated settings" });
});

module.exports = router;
