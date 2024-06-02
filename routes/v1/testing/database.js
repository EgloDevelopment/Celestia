require("dotenv").config();

const router = require("express").Router();

const { getMongo } = require("../../../databases/mongo");
const { getRedis } = require("../../../databases/redis");

router.get("/", async (req, res) => {
	const mongoClient = await getMongo();
	const redisClient = await getRedis();

	await mongoClient
		.db("EgloSocial")
		.collection("Posts")
		.insertOne({
			username: "testing",
			content: "tstestingskdfhsdjhf",
			tags: ["kitty", "car", "carkitty"],
		});

	const mongo = await mongoClient.db("EgloSocial").collection("Posts").findOne({
		content: "tstestingskdfhsdjhf",
	});

    await mongoClient.db("EgloSocial").collection("Posts").deleteOne({
		content: "tstestingskdfhsdjhf",
	});

	await redisClient.set("foo", "bar");
	const redis = await redisClient.get("foo");

	res.status(200).json({
		redis: redis,
        mongo: mongo
	});
});

module.exports = router;
