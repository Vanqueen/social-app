require('dotenv').config();
const express = require("express");
const routes = require("./src/routes");
const { connect } =require("mongoose");
const corsOptions = require("./src/config/cors.config");
const {notFound, errorHandler} =require("./src/middlewares/error.middleware")
const cookieParser = require('cookie-parser');
const upload = require("express-fileupload");
const { server, app } = require("./src/socket/socket")

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// const app = express();

// Middlewares de base
app.use(corsOptions);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload());

app.get("/", (req, res) => {
    res.send("Hello World 🚀🚀🚀 !");
});

// Routes
app.use("/api", routes);

// Middlewares d'erreur (toujours en dernier)
app.use(notFound);
app.use(errorHandler);


connect(MONGO_URI)
.then(() => server.listen(PORT, () => console.log("Serveur démarré sur le port", PORT)))
.catch((err) => console.log("Erreur lors de la connection :", err));

// app.listen(PORT, () => console.log("Serveur démarré sur le port", PORT));
