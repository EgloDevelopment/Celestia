var Docker = require("dockerode");

async function createContainer(image, name, repo_url) {
	var docker = new Docker({ socketPath: "/var/run/docker.sock" });

	try {
		await docker.createContainer(
			{ Image: image, name: name },
			function (err, container) {
				container.start(function (e, data) {
					if (e) {
						throw new Error(e);
					}

					console.log(data);
				});
			}
		);
	} catch (e) {
		throw new Error(e);
	}
}

module.exports = { createContainer };
