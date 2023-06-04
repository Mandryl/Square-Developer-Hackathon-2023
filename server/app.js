const express = require("express");
const envLoad = require("dotenv").config();
const morgan = require("morgan");
const path = require("path");
const Authenticate = require("./common/auth");
const logger = require("./common/logger");
const api = require("./routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));

const basicID = process.env.BASIC_ID;
const basicPass = process.env.BASIC_PASS;
const auth = new Authenticate(basicID,basicPass);
app.use(auth.initialize());
app.use(
    "/",
    // auth.authenticate(),
    express.static(path.join(__dirname, "../dist"))
);
app.use("/api", api);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`listening on ${port}`);
});