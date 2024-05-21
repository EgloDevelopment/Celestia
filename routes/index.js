require("dotenv").config();

const router = require("express").Router();

router.get("/", async (req, res) => {
    res.status(200).json({ message: "Celestia Backend" });
});

module.exports = router;
