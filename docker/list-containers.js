var Docker = require("dockerode");

async function listContainers(status) {
	var docker = new Docker({ socketPath: "/var/run/docker.sock" });

	try {
		let docker_containers = await docker.listContainers({filters: { status: [status] }});

		return docker_containers;
	} catch (e) {
		throw new Error(e);
	}
}

module.exports = { listContainers };
