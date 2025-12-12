const cors = require("cors");

const corsOptions = {
    origin: [
        "http://localhost:5173", 
        "http://localhost:5178", 
        process.env.FRONTEND_URL
    ], //Autorise un domaine spécique à contacter notre server
    // origin: process.env.FRONTEND_URL, //Autorise un domaine spécique à contacter notre server
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], //filtre les méthodes HTTP autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // Spécifie les en-têtes acceptées
    credentials: true, // Autoriser l'envoi de cookies & tokens
    optionsSuccessStatus: 200
}

// const corsOptions = {
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//     'allowedHeaders': ['sessionId', 'Content-Type'],
//     'exposedHeaders': ['sessionId'],
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     'preflightContinue': false
// }

module.exports = cors(corsOptions);
