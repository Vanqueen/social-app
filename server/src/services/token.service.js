const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const RefreshTokenModel = require("../models/refreshToken.model");
const { hashValue } = require("../utils/hash.util");


// création d'un access token pour la connexion et l'authentification
const createAccessToken = async (payload) => {
    return await jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        {expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRESIN}
    );
}

const timeToMs = (time) => {
    // 20m, 1h ou 2d
    if(time.endsWith('d')) return parseInt(time) * 24 * 60 * 60 * 1000 //jours en millisecondes
    if(time.endsWith('h')) return parseInt(time) * 60 * 60 * 1000 //heures en millisecondes
    if(time.endsWith('m')) return parseInt(time) * 60 * 1000 //minutes en millisecondes
    if(time.endsWith('s')) return parseInt(time) * 1000 //secondes en millisecondes
    return parseInt(time) //millisecondes

}

const createRefreshToken = async (userId, userAgent) => {
    const token = crypto.randomBytes(64).toString('hex'); // 128 caractères hexadécimaux
    const jti = crypto.randomBytes(16).toString('hex'); // 32 caractères hexadécimaux

    const expiresAt = new Date(Date.now() + timeToMs(process.env.JWT_REFRESH_TOKEN_EXPIRESIN));
    const tokenHash = await hashValue(token);

    await RefreshTokenModel.create({
        userId,
        jti,
        tokenHash,
        expiresAt,
        userAgent
    });

    return { token, jti, expiresAt };
}

module.exports = {
    createAccessToken,
    createRefreshToken
}
