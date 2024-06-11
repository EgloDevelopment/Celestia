// CONFIG
let backend_server_url = "http://localhost:3000"; // CHANGE
let backend_server_version = "v1";

// IMPORTS
const axios = require("axios");

// SESSION CONSTANTS
let token;

// BASE fUNCTIONS
async function makeBackendRequest(json) {
	if (json.auth_token) {
		let request = await axios({
			headers: {
				eglo_auth: json.auth_token,
			},
			method: json.method,
			url: `${backend_server_url}/${backend_server_version}/${json.url}`,
			data: json.data,
			validateStatus: () => true,
		});

		return request.data;
	} else {
		let request = await axios({
			method: json.method,
			url: `${backend_server_url}/${backend_server_version}/${json.url}`,
			data: json.data,
			validateStatus: () => true,
		});

		return request.data;
	}
}

// TOKEN
async function saveToken(request_data) {
	if (request_data.token.length > 0 && request_data.token !== "") {
		token = request_data.token;
	}
}

async function getToken() {
	return token;
}

// AUTHENTICATION
async function register(request_data) {
	let data = {};

	for (const key in request_data) {
		if (key !== "token") {
			data[key] = request_data[key];
		}
	}

	let request = await makeBackendRequest({
		method: "post",
		url: "authentication/register",
		data: data,
	});

	return request;
}

async function login(request_data) {
	let data = {};

	for (const key in request_data) {
		if (key !== "token") {
			data[key] = request_data[key];
		}
	}

	let request = await makeBackendRequest({
		method: "post",
		url: "authentication/login",
		data: data,
	});

	return request;
}

// DEVICES
async function getDevices(request_data) {
	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "devices/get",
		data: {},
	});

	return request;
}

async function registerDevice(request_data) {
	let data = {};

	for (const key in request_data) {
		if (key !== "token") {
			data[key] = request_data[key];
		}
	}

	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "devices/register",
		data: data,
	});

	return request;
}

async function removeDevice(request_data) {
	let data = {};

	for (const key in request_data) {
		if (key !== "token") {
			data[key] = request_data[key];
		}
	}

	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "devices/remove",
		data: data,
	});

	return request;
}

async function updateDevice(request_data) {
	let data = {};

	for (const key in request_data) {
		if (key !== "token") {
			data[key] = request_data[key];
		}
	}

	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "devices/update",
		data: data,
	});

	return request;
}

// CLIPBOARD
async function clearClipboard(request_data) {
	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "functions/clipboard/clear",
		data: {},
	});

	return request;
}

async function getClipboard(request_data) {
	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "functions/clipboard/get",
		data: {},
	});

	return request;
}

async function setClipboard(request_data) {
	let data = {};

	for (const key in request_data) {
		if (key !== "token") {
			data[key] = request_data[key];
		}
	}

	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "functions/clipboard/set",
		data: data,
	});

	return request;
}

// GPS
async function removeGPS(request_data) {
	let data = {};

	for (const key in request_data) {
		if (key !== "token") {
			data[key] = request_data[key];
		}
	}

	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "functions/gps/remove",
		data: data,
	});

	return request;
}

async function updateGPS(request_data) {
	let data = {};

	for (const key in request_data) {
		if (key !== "token") {
			data[key] = request_data[key];
		}
	}

	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "functions/gps/update",
		data: data,
	});

	return request;
}

// ACCOUnt
async function deleteAccount(request_data) {
	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "settings/delete-account",
		data: {},
	});

	return request;
}

async function getAccount(request_data) {
	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "settings/get",
		data: {},
	});

	return request;
}

async function updateAccount(request_data) {
	let data = {};

	for (const key in request_data) {
		if (key !== "token") {
			data[key] = request_data[key];
		}
	}

	let request = await makeBackendRequest({
		auth_token: token || request_data.token,
		method: "post",
		url: "settings/update",
		data: data,
	});

	return request;
}

module.exports = {
	saveToken,
	getToken,

	register,
	login,

	getDevices,
	registerDevice,
	removeDevice,
	updateDevice,

    clearClipboard,
    getClipboard,
    setClipboard,

    removeGPS,
    updateGPS,

    deleteAccount,
    getAccount,
    updateAccount
};
