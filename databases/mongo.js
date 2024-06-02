const MongoClient = require("mongodb").MongoClient;
const mongoDbUrl = process.env.MONGODB_URL;

let client;

async function connectMongo() {
	try {
		if (!client) {
			client = await MongoClient.connect(mongoDbUrl);
			console.log("Connected to MongoDB");
		}
	} catch (e) {
		console.log("Could not connect to MongoDB");
	}
}

async function getMongo() {
	if (!client) {
		await connectMongo();
	}

	try {
		return client;
	} catch (e) {
		console.log("Failed to return MongoDB client");
	}
}

async function closeMongo() {
	try {
		if (client) {
			client.close();
			console.log("Closed the MongoDB connection");
		} else {
			console.log("No MongoDB connection to close");
		}
	} catch (e) {
		console.log("Could not close MongoDB connection");
	}
}

module.exports.connectMongo = connectMongo;

module.exports.getMongo = getMongo;

module.exports.closeMongo = closeMongo;
