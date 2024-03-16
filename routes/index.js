const router = require("express").Router();

const { getContainerCount } = require("@/docker/get-container-count");

router.get("/", async (req, res, next) => {
	try {
		let total_containers = await getContainerCount();

		res.send({
			status: "online",
			message: "Welcome to Celestia",
			total_containers: `I have ${total_containers} containers under my control, you're in good hands.`,
		});
	} catch (e) {
		next(e);
	}
});

module.exports = router;
