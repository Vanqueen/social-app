require('dotenv').config();
const express = require("express");
const routes = require("./src/routes")

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World 🚀🚀🚀 !");
});

app.listen(PORT, () => console.log("Serveur démarré sur le port", PORT));
