const router = require("express").Router();

const { listContainers } = require("@/docker/list-containers");

router.get("/", async (req, res, next) => {
	try {
		let requested_status = req.query.status || "running"

		let containers = await listContainers(requested_status);

		res.status(200).json(containers);
	} catch (e) {
		next(e)
	}
});

module.exports = router;
