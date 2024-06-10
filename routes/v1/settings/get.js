require("dotenv").config();

const router = require("express").Router();

const jwt = require("jsonwebtoken");
const { getMongo } = require("../../../databases/mongo");

router.post("/", async (req, res) => {
	if (!req.headers.eglo_auth) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}
	
	const verified = await jwt.verify(req.headers.eglo_auth, process.env.SERVER_TOKEN_SECRET);

	const mongo = await getMongo();

	const retrieved_user = await mongo.db("Eglo").collection("Users").findOne({
		id: verified.user_id,
	});

	res.status(200).json(retrieved_user);
});

module.exports = router;
