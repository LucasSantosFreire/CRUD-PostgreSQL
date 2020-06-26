const Sequelize = require("sequelize");
const db = require("../config/database.js");
const User = require("../models/User");

const connection = new Sequelize(db);

User.init(connection);

module.exports = connection;
