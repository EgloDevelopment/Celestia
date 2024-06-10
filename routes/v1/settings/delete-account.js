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

	// PLSSSSS dont be resource intensive
	const database_collections = await mongo.db("Eglo").listCollections().toArray();

	// Doing this so I dont have to redo this fucking file every time I add a new feature
	database_collections.forEach((collection) => {
		if (collection.name !== "Users") {
			mongo.db("Eglo").collection(collection.name).deleteMany({ owner_id: verified.user_id }); // Thank god for consistent naming practices
		}
	});

	await mongo.db("Eglo").collection("Users").deleteOne({ id: verified.user_id });

	res.status(200).json({ message: "Deleted account" });
});

module.exports = router;
