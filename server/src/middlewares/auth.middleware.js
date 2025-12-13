const HttpError = require("../models/error.model");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.cookie?.accessToken;
        console.log("token dans les cookie", token);
        if (!token) {
            return next(new HttpError("Authentification refusée ! Token absent", 401));
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, info) => {
            if (err) {
                return next(new HttpError("Authentification refusée ! Token invalide", 401));
            }
            req.userId = info.userId;
            next();
        });
        
    } catch (error) {
        return next(new HttpError("Une erreur est survenue lors de l'authentification", 500));
    }
}

module.exports = {
    authMiddleware,
}

