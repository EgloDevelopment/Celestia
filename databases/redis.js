const redis = require("redis");
const redisUrl = process.env.REDIS_URL;

let client;

async function connectRedis() {
	try {
		if (!client) {
			client = redis.createClient({ url: redisUrl });
			await client.connect();
			console.log("Connected to Redis");
		}
	} catch (e) {
		console.log("Could not connect to Redis");
	}
}

async function getRedis() {
	if (!client) {
		await connectRedis();
	}

	try {
		return client;
	} catch (e) {
		console.log("Failed to return Redis client");
	}
}

async function closeRedis() {
	try {
		if (client) {
			client.quit();
			console.log("Closed the Redis connection");
		} else {
			console.log("No Redis connection to close");
		}
	} catch (e) {
		console.log("Could not close Redis connection");
	}
}

module.exports.connectRedis = connectRedis;
module.exports.getRedis = getRedis;
module.exports.closeRedis = closeRedis;
