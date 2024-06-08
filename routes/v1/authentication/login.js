require("dotenv").config();

const router = require("express").Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { getMongo } = require("../../../databases/mongo");

const Schema = z.object({
	email: z.string().email(),
	password: z.string().min(5).max(50),
});

router.get("/", async (req, res) => {
	try {
		Schema.parse(req.body);
	} catch (e) {
		res.status(400).json(e.issues);
		return;
	}

	const mongo = await getMongo();

	let retrieved_user = await mongo.db("Eglo").collection("Users").findOne({
		email: req.body.email,
	});

	if (!retrieved_user) {
		res.status(400).json({ message: "Account does not exist" });
		return;
	}

	let password_compare = bcrypt.compareSync(password, retrieved_user.password);

	if (password_compare === false) {
		res.status(400).json({ message: "Incorrect password" });
		return;
	}

	let token = jwt.sign({ user_id: retrieved_user.id }, process.env.SERVER_TOKEN_SECRET);

	res.status(200).json({ message: "You have been logged in", token: token });
});

module.exports = router;
