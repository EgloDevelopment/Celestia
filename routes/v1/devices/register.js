require("dotenv").config();

const router = require("express").Router();

const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { getMongo } = require("../../../databases/mongo");
const { uuidv7 } = require("uuidv7");

const Schema = z.object({
	device_bluetooth_address: z.string().regex("/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/"),
	device_last_reported_location_1_meter: z.string().min(10).max(400),
	device_last_reported_location_5_meter: z.string().min(10).max(400),

	device_type: z.string(), // desktop, laptop, phone, tablet, watch
	device_os: z.string(), // windows, linux, mac, ios, watchos
	device_model: z.string(), // manufacturer models

	device_name: z.string().min(2).max(50),

	preferred_device_contact: z.string().min(2).max(50), // bluetooth, gps
});

router.get("/", async (req, res) => {
	try {
		Schema.parse(req.body);
	} catch (e) {
		res.status(400).json(e.issues);
		return;
	}

	let generated_device_id = uuidv7();

	const mongo = await getMongo();

	await mongo.db("Eglo").collection("Users").insertOne({
		id: generated_user_id,
		name: req.body.name,
		email: req.body.email,
		password: hashed_password,
		devices: [],
		notifications: [],
		logs: [],
	});

	let token = jwt.sign({ user_id: generated_user_id }, process.env.SERVER_TOKEN_SECRET);

	res.status(200).json({ message: "Your account was created", token: token });
});

module.exports = router;
