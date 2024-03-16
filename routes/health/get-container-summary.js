const router = require("express").Router();

const { listContainers } = require("@/docker/list-containers");
const { getContainerCount } = require("@/docker/get-container-count");

router.get("/", async (req, res, next) => {
	try {
		let created_containers = await listContainers("created");
		let restarting_containers = await listContainers("restarting");
		let running_containers = await listContainers("running");
		let removing_containers = await listContainers("removing");
		let paused_containers = await listContainers("paused");
		let exited_containers = await listContainers("exited");
		let dead_containers = await listContainers("dead");
		let total_containers = await getContainerCount();

		res.status(200).json({
			created_containers: created_containers.length,
			restarting_containers: restarting_containers.length,
			running_containers: running_containers.length,
			removing_containers: removing_containers.length,
			paused_containers: paused_containers.length,
			exited_containers: exited_containers.length,
			dead_containers: dead_containers.length,
			total_containers: total_containers,
		});
	} catch (e) {
		next(e);
	}
});

module.exports = router;
