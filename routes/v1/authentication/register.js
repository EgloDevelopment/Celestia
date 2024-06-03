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
		password_1: z.string().min(5).max(50),
		password_2: z.string().min(5).max(50),

		// Not needed moving to another API function
		//current_device_bluetooth_address: z.string().regex("/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/"),
		//current_device_type: z.string(),
		//current_device_os: z.string(),
		//current_device_model: z.string(),
		//current_device_name: z.string().min(2).max(50),
	})
	.refine((data) => data.password_1 === data.password_2, {
		message: "Passwords don't match",
		path: ["confirm"],
	});

router.get("/", async (req, res) => {
	try {
		Schema.parse(req.body);
	} catch (e) {
		res.status(400).json(e.issues);
		return;
	}

	let hashed_password = await bcrypt.hashSync(password_1, 10);
	let user_ip_address = req.ip;
	let generated_user_id = uuidv7();

	const mongo = await getMongo();

	await mongo.db("Eglo").collection("Users").insertOne({
		id: generated_user_id,
		name: req.body.name,
		email: req.body.email,
		password: hashed_password,
		last_used_ip_address: user_ip_address,
		devices: [],
		notifications: [],
		logs: [],
	});

	let token = jwt.sign({ user_id: generated_user_id }, process.env.SERVER_TOKEN_SECRET);

	res.status(200).json({ message: "Your account was created", token: token });
});

module.exports = router;

/*
const verified = jwt.verify(token, jwtSecretKey);
if (verified) {
	console.log(verified)
    return res.send("Successfully Verified");
} else {
    // Access Denied
    return res.status(401).send(error);
}
*/
