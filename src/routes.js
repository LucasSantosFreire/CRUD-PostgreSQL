const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");
const { username } = require("./config/database");

routes.get("/users", UserController.index);
routes.post("/users", UserController.store);
routes.get("/users/:id", UserController.search);
routes.put("/users/:id", UserController.change);
routes.delete("/users/:id", UserController.delete);

module.exports = routes;
