require("dotenv").config();

const router = require("express").Router();

const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { getMongo } = require("../../../databases/mongo");

const Schema = z.object({
	device_id: z.string().uuid(),
    
	device_type: z.enum(["desktop", "laptop", "phone", "tablet", "watch"]).optional(),
	device_os: z.enum(["linux", "windows", "ios", "watchos", "macos", "android"]).optional(),
	device_model: z.string().min(0).max(120).optional(),

	device_name: z.string().min(2).max(50).optional(),

	preferred_device_contact: z.enum(["gps", "bluetooth", "none"]).optional(),
	
	primary_device: z.boolean().optional(),
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

	const original_device_data = await mongo.db("Eglo").collection("Devices").findOne({ owner_id: verified.user_id, id: req.body.device_id });

	const user_device_count = await mongo.db("Eglo").collection("Devices").find({ owner_id: verified.user_id }).toArray();

	if (user_device_count.filter((device) => device.is_primary === true).length >= 3 && req.body.primary_device === true) {
		res.status(400).json({ message: "You can not have more than 3 primary devices, please remove one" });
		return;
	}

	await mongo
		.db("Eglo")
		.collection("Devices")
		.updateOne(
			{ owner_id: verified.user_id, id: req.body.device_id },
			{
				$set: {
					name: req.body.device_name || original_device_data.name,
					is_primary: req.body.primary_device || original_device_data.is_primary,
					preferred_contact: req.body.preferred_device_contact || original_device_data.preferred_contact,

					type: req.body.device_type || original_device_data.type,
					os: req.body.device_os || original_device_data.os,
					model: req.body.device_model || original_device_data.model,
				},
			}
		);

	res.status(200).json({ message: "Updated device settings" });
});

module.exports = router;
