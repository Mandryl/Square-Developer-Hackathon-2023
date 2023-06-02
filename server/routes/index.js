const express = require("express");
const router = express.Router();

const image = require("./coffeeImage");
const desc = require("./coffeeDesc");

router.post("/generateImage", image.generateImage);
router.post("/generateDesc", desc.generateDesc);

module.exports = router;