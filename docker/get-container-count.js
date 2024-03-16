var Docker = require("dockerode");

async function getContainerCount() {
	var docker = new Docker({ socketPath: "/var/run/docker.sock" });

	try {
		let all_containers = await docker.listContainers({ all: true });

		return all_containers.length;
	} catch (e) {
		throw new Error(e);
	}
}

module.exports = { getContainerCount };
