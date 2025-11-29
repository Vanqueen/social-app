const HttpError = require("../models/error.model");
const UserModel = require("../models/user.model");
const { createAccessToken, createRefreshToken } = require("../services/token.service");
const { hashValue, compareValue } = require("../utils/hash.util");

/**
 * Enregistrement d'un utilisateur
 * POST : api/users/register
 */
const registerUser = async (req, res, next) => {

    try {
        const { fullName, email, password, confirmPassword } = req.body;

        // Vérification des champs obligatoires
        if (!fullName || !email || !password || !confirmPassword) {
            return next(new HttpError("Merci de remplir les champs", 422));
        }

        // Normalisation de l'adresse mail
        const lowerCaseEmail = email.toLowerCase();

        // Vérification de la conformité des mots de passe
        if (password !== confirmPassword) {
            return next(new HttpError("Les mots de passe ne correspondent pas. Merci de réessayer !!", 422));
        }

        if(password.length < 8) return next(new HttpError("Mot de passe trop court, 8 caractères au minimum !!", 422))

        //Vérifier si l'adresse mail n'est pas déjà lié à un compte utilisateur
        const emailExists = await UserModel.findOne({ email: lowerCaseEmail });
        if (emailExists) return next(new HttpError("Désolé, cette adresse mail est déjà utilisé. Merci de réessayer !!", 422));

        // hashage du mot de passe
        const hashPassword = await hashValue(password);


        const newUser = await UserModel.create({
            fullName,
            email: lowerCaseEmail,
            password: hashPassword,
            confirmPassword: hashPassword,
        });
        const {fullName: userFullName} = newUser

        res.status(201).json({ 
            message: `Utilisateur ${userFullName} enregistré avec succès !`, 
            // user: newUser 
        })
    } catch (error) {
        return next(new HttpError(error.message || "Erreur lors de l'enregistrement", 500));
    }
}

/**
 * Methode de connexion
 * POST : api/users/login
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //Vérifier que les valeurs existent 
        if (!email || !password) {
            return next(new HttpError("Tous les champs sont requis !", 422));
        }

        // Normalisation de l'addresse mail 
        const lowerCasedEmail = email.toLowerCase();

        // Recherche de l'utilisateur en bdd
        const user = await UserModel.findOne({email: lowerCasedEmail});

        if(!user) {
            return next(new HttpError("Identifiants invalides !", 422));
        }

        const isMatch = await compareValue(password, user.password);
        if(!isMatch) return next(new HttpError("Identifiants invalides !", 401));

        const payload = { userId: user._id };

        const accessToken = await createAccessToken(payload);
        const refreshToken = await createRefreshToken(user._id.toString(), req.get("User-Agent"));

        res.cookie("accessToken", JSON.stringify({
            httpOnly: true,
            sameSite: "strict",
            maxAge: timeToMs(procces.env.JWT_ACCESS_TOKEN_EXPIRESIN)
        }));

        res.cookie("refreshToken", JSON.stringify({
            jti: refreshToken.jti,
            token: refreshToken.token
        }), {
            httpOnly: true,
            sameSite: "strict",
            maxAge: timeToMs(procces.env.JWT_REFRESH_TOKEN_EXPIRESIN)
        })

        res.status(200).json({ succes: true, message: "Utilisateur authentifier avec succès !", accessToken });
    } catch (error) {
        console.error("Erreur lors de l'authentification de l'utilisateur !", error);
        return next(new HttpError("Erreur lors de l'authentification de l'utilisateur !", 500))
    }
}

/**
 * Methode de déconnexion
 * POST : api/users/logout
 */
const logoutUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}

/**
 * Rafrîchir le token d'accès à partir du refresh token
 * POST : api/users/generateNewAccesToken
 */
const renewAccessToken = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}

/**
 * Méthode de récupération d'un utilisateur
 * GET : api/users/:id
 */
const getUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}

/**
 * Méthode de récupération des utilisateurs
 * GET : api/users/all
 */
const getUsers = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}

/**
 * Méthode de modification d'un utilisateur
 * PATCH : api/users/:id
 * Protected
 */
const editUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}

/**
 * Suivre/ ne plus suivre un utilisateur
 * PATCH : api/users/:id/follow-unfollow
 * Protected
 */
const followUnfollowUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}

/**
 * Méthode de modification de l'avatar d'un utilisateur
 * POST : api/users/avatar
 * Protected
 */ 
const changeUserAvatar = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    renewAccessToken,
    getUser,
    getUsers,
    editUser,
    followUnfollowUser,
    changeUserAvatar
}