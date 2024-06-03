require("dotenv").config();

const router = require("express").Router();

const { getMongo } = require("../../../databases/mongo");
const { getRedis } = require("../../../databases/redis");

router.get("/", async (req, res) => {
	const mongo = await getMongo();
	const redis = await getRedis();

	await mongo
		.db("EgloSocial")
		.collection("Posts")
		.insertOne({
			username: "testing",
			content: "tstestingskdfhsdjhf",
			tags: ["kitty", "car", "carkitty"],
		});

	const mongo_response = await mongo.db("EgloSocial").collection("Posts").findOne({
		content: "tstestingskdfhsdjhf",
	});

    await mongo.db("EgloSocial").collection("Posts").deleteOne({
		content: "tstestingskdfhsdjhf",
	});

	await redis.set("foo", "bar");
	const redis_response = await redis.get("foo");

	res.status(200).json({
		redis: redis_response,
        mongo: mongo_response
	});
});

module.exports = router;
