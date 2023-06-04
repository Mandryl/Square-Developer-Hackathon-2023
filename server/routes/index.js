const express = require("express");
const router = express.Router();

// Square API
const square = require('./square');
router.use('/', square);

// Generative AI API
const image = require("./coffeeImage");
const desc = require("./coffeeDesc");
router.post("/generateImage", image.generateImage);
router.post("/generateDesc", desc.generateDesc);

module.exports = router;