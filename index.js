require('module-alias/register');

const express = require("express");
const app = express();
const port = 3000;

const magic = require('express-routemagic')
magic.use(app)

app.listen(port, () => {
	console.log(`Celestia running on port ${port}`);
});
