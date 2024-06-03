const express = require("express");
const magic = require("express-routemagic");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", true); // Needed to get the user IP

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

magic.use(app, {
	routesFolder: "./routes",
	//logMapping: true,
});

app.listen(3000, () => {
	console.log("Celestia listening on port 3000");
});
