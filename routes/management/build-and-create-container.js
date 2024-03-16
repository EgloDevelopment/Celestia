const router = require("express").Router();

const { buildImage } = require("@/docker/build-image");
const { createContainer } = require("@/docker/create-container");

router.post("/", async (req, res, next) => {
	try {
		console.log(await buildImage("testing", "https://github.com/EgloDevelopment/EgloPayments/archive/main.zip"))

		res.status(200).json({});
	} catch (e) {
		next(e);
	}
});

module.exports = router;
