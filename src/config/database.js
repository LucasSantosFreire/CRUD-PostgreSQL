require("dotenv").config();
module.exports = {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: 8080,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "desafio",
    define: {
        timestamps: true,
        underscored: true,
    },
};
