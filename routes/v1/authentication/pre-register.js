require("dotenv").config();

const router = require("express").Router();

const { z } = require("zod");
const { getMongo } = require("../../../databases/mongo");
const { uuidv7 } = require("uuidv7");

const Schema = z.object({
	name: z.string().min(2).max(50),
	email: z.string().email(),
});

router.post("/", async (req, res) => {
	try {
		Schema.parse(req.body);
	} catch (e) {
		res.status(400).json(e.issues);
		return;
	}

	let generated_pre_register_id = uuidv7();

	const mongo = await getMongo();

	const user_document = await mongo
		.db("Eglo")
		.collection("Pre-Registers")
		.updateOne(
			{ email: req.body.email },
			{
				$setOnInsert: {
					id: generated_pre_register_id,
					name: req.body.name,
					email: req.body.email,
					pre_register_date: Date.now(),
				},
			},
			{ upsert: true }
		);

	if (user_document.upsertedCount === 0) {
		res.status(400).json({ message: "An account already exists with that email" });
		return;
	}

	res.status(200).json({ message: "You have been pre-registered" });
});

module.exports = router;
