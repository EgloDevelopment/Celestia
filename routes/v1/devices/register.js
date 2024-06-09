require("dotenv").config();

const router = require("express").Router();

const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { getMongo } = require("../../../databases/mongo");
const { uuidv7 } = require("uuidv7");

const Schema = z.object({
	device_bluetooth_address: z.string().min(2).max(60),

	device_gps_latitude: z.string().min(2).max(400),
	device_gps_longitude: z.string().min(2).max(400),
	device_gps_accuracy: z.string().min(2).max(400),

	device_type: z.enum(["desktop", "laptop", "phone", "tablet", "watch"]),
	device_os: z.enum(["linux", "windows", "ios", "watchos", "macos", "android"]),
	device_model: z.string().min(0).max(120), // manufacturer models

	device_name: z.string().min(2).max(50),

	preferred_device_contact: z.enum(["gps", "bluetooth", "none"]),

	primary_device: z.boolean(),
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

	let generated_device_id = uuidv7();

	const verified = await jwt.verify(req.headers.eglo_auth, process.env.SERVER_TOKEN_SECRET);

	const mongo = await getMongo();

	const user_device_count = await mongo.db("Eglo").collection("Users").findOne({ id: verified.user_id });

	if (user_device_count.devices.length >= 20) {
		res.status(400).json({ message: "You can not have more than 20 devices, please remove one" });
		return;
	}

	if (user_device_count.devices.filter((device) => device.is_primary === true).length >= 3) {
		res.status(400).json({ message: "You can not have more than 3 primary devices, please remove one" });
		return;
	}

	await mongo
		.db("Eglo")
		.collection("Users")
		.updateOne(
			{ id: verified.user_id },
			{
				$push: {
					devices: {
						id: generated_device_id,
						is_primary: req.body.primary_device,
						name: req.body.device_name,
						type: req.body.device_type,
						os: req.body.device_os,
						model: req.body.device_model,
						bluetooth_address: req.body.device_bluetooth_address,
						gps: {
							latitude: req.body.device_gps_latitude,
							longitude: req.body.device_gps_longitude,
							accuracy: req.body.device_gps_accuracy,
						},
						preferred_contact: req.body.preferred_device_contact,
					},
				},
			}
		);

	res.status(200).json({ message: "Device was added", id: generated_device_id });
});

module.exports = router;
