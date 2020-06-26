const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");
require("./src/database");
const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());
app.use(routes);
app.listen(port);

console.debug("Server listening on port " + port);
