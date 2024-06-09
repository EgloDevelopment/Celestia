require("dotenv").config();

const router = require("express").Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { getMongo } = require("../../../databases/mongo");
const { uuidv7 } = require("uuidv7");

const Schema = z
	.object({
		name: z.string().min(2).max(50),
		email: z.string().email(),
		password_1: z.string().min(7).max(50),
		password_2: z.string().min(7).max(50),
	})
	.refine((data) => data.password_1 === data.password_2, {
		message: "Passwords don't match",
		path: ["confirm"],
	});

router.post("/", async (req, res) => {
	try {
		Schema.parse(req.body);
	} catch (e) {
		res.status(400).json(e.issues);
		return;
	}

	let hashed_password = await bcrypt.hashSync(req.body.password_1, 10);
	let generated_user_id = uuidv7();

	const mongo = await getMongo();

	const user_document = await mongo
		.db("Eglo")
		.collection("Users")
		.updateOne(
			{ email: req.body.email },
			{
				$setOnInsert: {
					id: generated_user_id,
					name: req.body.name,
					email: req.body.email,
					password: hashed_password,
					last_login: Date.now(),
					notifications: [],
					logs: [],
				},
			},
			{ upsert: true }
		);

	if (user_document.upsertedCount === 0) {
		res.status(400).json({ message: "An account already exists with that email" });
		return;
	}

	let token = await jwt.sign({ user_id: generated_user_id }, process.env.SERVER_TOKEN_SECRET);

	res.status(200).json({ message: "Your account was created", token: token });
});

module.exports = router;
