var Docker = require("dockerode");

async function buildImage(name, tar_location) {
	var docker = new Docker({ socketPath: "/var/run/docker.sock" });

	try {
		await docker.buildImage(tar_location, { t: name }, function (e, response) {
			if (e) {
				throw new Error(e);
			}

			return response;
		});
	} catch (e) {
		throw new Error(e);
	}
}

module.exports = { buildImage };
