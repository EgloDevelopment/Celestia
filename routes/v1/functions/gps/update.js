require("dotenv").config();

const router = require("express").Router();

const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { getMongo } = require("../../../../databases/mongo");

const Schema = z.object({
	device_id: z.string().uuid(),

	device_gps_latitude: z.string().min(2).max(400),
	device_gps_longitude: z.string().min(2).max(400),
	device_gps_accuracy: z.string().min(2).max(400),
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

	await mongo
		.db("Eglo")
		.collection("Devices")
		.updateOne(
			{ owner_id: verified.user_id, id: req.body.device_id },
			{
				$set: {
					gps_latitude: req.body.device_gps_latitude,
					gps_longitude: req.body.device_gps_longitude,
					gps_accuracy: req.body.device_gps_accuracy,
				},
			}
		);

	res.status(200).json({ message: "Location was updated" });
});

module.exports = router;
