const { utils, cloudinary_js_config } = require("../config/cloudinary.config");
const cloudinary = require("../config/cloudinary.config");
const HttpError = require("../models/error.model");
const UserModel = require("../models/user.model");
const {
  createAccessToken,
  createRefreshToken,
  timeToMs,
  revokeRefreshToken,
  verifyRefreshToken,
} = require("../services/token.service");
const { hashValue, compareValue } = require("../utils/hash.util");
const uuid = require("uuid").v4;
require("dotenv").config();
const path = require("path");

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
      return next(
        new HttpError(
          "Les mots de passe ne correspondent pas. Merci de réessayer !!",
          422
        )
      );
    }

    if (password.length < 8)
      return next(
        new HttpError(
          "Mot de passe trop court, 8 caractères au minimum !!",
          422
        )
      );

    //Vérifier si l'adresse mail n'est pas déjà lié à un compte utilisateur
    const emailExists = await UserModel.findOne({ email: lowerCaseEmail });
    if (emailExists)
      return next(
        new HttpError(
          "Désolé, cette adresse mail est déjà utilisé. Merci de réessayer !!",
          422
        )
      );

    // hashage du mot de passe
    const hashPassword = await hashValue(password);

    const newUser = await UserModel.create({
      fullName,
      email: lowerCaseEmail,
      password: hashPassword,
      confirmPassword: hashPassword,
    });
    const { fullName: userFullName } = newUser;

    res.status(201).json({
      message: `Utilisateur ${userFullName} enregistré avec succès !`,
      // user: newUser
    });
  } catch (error) {
    return next(
      new HttpError(error.message || "Erreur lors de l'enregistrement", 500)
    );
  }
};

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
    const user = await UserModel.findOne({ email: lowerCasedEmail });

    if (!user) {
      return next(new HttpError("Identifiants invalides !", 422));
    }

    const isMatch = await compareValue(password, user.password);
    if (!isMatch) return next(new HttpError("Identifiants invalides !", 401));
    const payload = { userId: user._id };

    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(
      user._id.toString(),
      req.get("User-Agent")
    );

    // ✅ 6️⃣ Prépare les données à renvoyer sans le mot de passe
    // const { password: _, ...userInfo } = user._doc;
    const { password: _, confirmPassword: __, __v: ___, ...userInfo } = user._doc;

    res.cookie(
      "refreshToken",
      JSON.stringify({ jti: refreshToken.jti, token: refreshToken.token }),
      {
        httpOnly: true,
        sameSite: "strict",
        domain: "localhost",
        maxAge: timeToMs(process.env.JWT_REFRESH_TOKEN_EXPIRESIN),
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      domain: "localhost",
      maxAge: timeToMs(process.env.JWT_ACCESS_TOKEN_EXPIRESIN),
    });

    res
      .status(200)
      .json({
        succes: true,
        message: "Utilisateur authentifier avec succès !",
        accessToken,
        user: userInfo,
      });
  } catch (error) {
    console.error(
      "Erreur lors de l'authentification de l'utilisateur !",
      error
    );
    return next(
      new HttpError("Erreur lors de l'authentification de l'utilisateur !", 500)
    );
  }
};

/**
 * Methode de déconnexion
 * POST : api/users/logout
 */
const logoutUser = async (req, res, next) => {
  try {
    const refreshCookie = req.cookies?.refreshToken || req.cookie?.refreshToken;

    if (!refreshCookie)
      return next(new HttpError("Aucun token de rafraîchissement trouvé", 400));

    // Parse le JSON du cookie
    let parsed;
    try {
      parsed = JSON.parse(refreshCookie);
    } catch (error) {
      return next(new HttpError("Format de token invalide", 400));
    }
    const { jti } = parsed;

    // Révoque (supprime) le token dans la BDD
    const deleted = await revokeRefreshToken(jti);
    if (!deleted) return next(new HttpError("Le token n'existe plus", 404));
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
    });
    return res.status(200).json({
        succes: true,
        message: "Déconnexion réussie 👋",
    })
  } catch (error) {
    console.error("❌ Erreur logoutUser:", error);
    return next(new HttpError("Erreur serveur", 500));
  }
};

/**
 * Rafrîchir le token d'accès à partir du refresh token
 * POST : api/users/generateNewAccesToken
 */
const renewAccessToken = async (req, res, next) => {
  try {
    // ✅ 1️⃣ Récupère le cookie de rafraîchissement
    const refreshCookie = req.cookies?.refreshToken || req.cookie?.refreshToken;

    if (!refreshCookie) {
      return next(new HttpError("Aucun token de rafraîchissement trouvé", 400));
    }

    // ✅ 2️⃣ Parse le JSON du cookie
    let parsed;
    try {
      parsed = JSON.parse(refreshCookie);
    } catch {
      return next(new HttpError("Format de token invalide", 400));
    }

    const { jti, token } = parsed;

    // ✅ 3️⃣ Récupère l'ID utilisateur depuis la BDD
    const userId = await verifyRefreshToken(jti, token);

    if (!userId) {
      return next(
        new HttpError("Token de rafraîchissement invalide ou expiré", 403)
      );
    }

    // ✅ 4️⃣ Génère un nouveau token d'accès
    const accessToken = await createAccessToken({ userId });

    // ✅ 5️⃣ Met à jour le cookie accessToken
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: timeToMs(process.env.JWT_ACCESS_TOKEN_EXPIRESIN),
    });
    // res.send("Token verified");

    // ✅ 6️⃣ Réponse au client
    return res.status(200).json({
      success: true,
      message: "Nouveau token généré ✅",
      accessToken: accessToken,
    });
  } catch (error) {
    console.error("❌ Erreur dans refreshAccessToken:", error);
    return next(new HttpError(error.message || "Erreur serveur", 500));
  }
};

/**
 * Méthode de récupération d'un utilisateur
 * GET : api/users/:id
 */
const getUser = async (req, res, next) => {
  try {
    // ✅ 1️⃣ Récupération de l'ID passé en paramètre d'URL
    const { id } = req.params;

    // ✅ 2️⃣ Recherche de l'utilisateur en base de données
    // On exclut certains champs sensibles avec .select()
    const user = await UserModel.findById(id).select(
      "-password -email -updatedAt -__v"
    );

    // ✅ 3️⃣ Vérifie si l'utilisateur existe
    if (!user) {
      return next(new HttpError("Utilisateur non identifié", 404));
    }

    // ✅ 4️⃣ Retourne les données publiques de l'utilisateur
    return res.status(200).json({
      success: true,
      message: "Utilisateur trouvé ✅",
      user,
    });
  } catch (error) {
    console.error("❌ Error in getUser:", error);
    return next(new HttpError(error.message || "Erreur serveur", 500));
  }
};

/**
 * Méthode de récupération des utilisateurs
 * GET : api/users/all
 */
const getUsers = async (req, res, next) => {
  try {
    // ✅ 1️⃣ Récupère les paramètres de pagination depuis la query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ 2️⃣ Récupère les utilisateurs les plus récents, sans champs sensibles
    const users = await UserModel.find()
      .select("-password -email -__v -updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // ✅ 3️⃣ Compte le total pour la pagination
    const totalUsers = await UserModel.countDocuments();

    // ✅ 4️⃣ Retourne une réponse cohérente
    return res.status(200).json({
      success: true,
      message: "Liste des utilisateurs récupérée avec succès ✅",
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    console.error("❌ Error in getUsers:", error);
    return next(new HttpError(error.message || "Erreur serveur", 500));
  }
};

/**
 * Méthode de modification d'un utilisateur
 * PATCH : api/users/:id
 * Protected
 */
const editUser = async (req, res, next) => {
  try {
    if(!req.userId){
        return next(new HttpError("Authentication required", 401));
    }
    const { fullName, bio } = req.body;
    if (!fullName && !bio) {
        return next(new HttpError("Aucune donnée à mettre à jour", 400));
    }
    const data = {};
    if (fullName) data.fullName = fullName;
    if (bio) data.bio = bio;
    const editedUser = await UserModel.findByIdAndUpdate(
        req.userId,
        data,
        { new: true } // retourne la version mise à jour
    ).select("-password -confirmPassword");
    if (!editedUser) {
        return next(new HttpError("Utilisateur non trouvé", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully ✅",
      user: editedUser,
    });
  } catch (error) {
    console.error("❌ Error in editUser:", error);
    return next(new HttpError(error.message || "Server error", 500));
  }
};

/**
 * Suivre/ ne plus suivre un utilisateur
 * PATCH : api/users/:id/follow-unfollow
 * Protected
 */
const followUnfollowUser = async (req, res, next) => {
  try {
    const userToFollowId = req.params.id;

    // ✅ 1️⃣ Vérifie l'authentification
    if (!userToFollowId) {
      return next(new HttpError("Authentification requise", 401));
    }

    // ✅ 2️⃣ Vérifie que l'utilisateur cible est différent de l'utilisateur courant
    if (req.userId === userToFollowId) {
      return next(
        new HttpError(
          "Vous ne pouvez pas vous suivre ou vous désabonner vous-même",
          422
        )
      );
    }

    // ✅ 3️⃣ Vérifie que l'utilisateur à suivre existe
    const userToFollow = await UserModel.findById(userToFollowId);
    if (!userToFollow) {
      return next(new HttpError("Utilisateur introuvable", 404));
    }

    // ✅ 4️⃣ Récupère l'utilisateur courant
    const currentUser = await UserModel.findById(req.userId);
    if (!currentUser) {
      return next(new HttpError("Utilisateur courant introuvable", 404));
    }
    const isFollowers = userToFollow.followers.find(id => id.toString()  == req.userId.toString());

    // ✅ 5️⃣ Vérifie si l'utilisateur courant suit déjà la cible
    let updatedTargetUser;
    let updatedCurrentUser;
    let message;

    if (!isFollowers) {
      // ➕ Suivre un utilisateur
      updatedTargetUser = await UserModel.findByIdAndUpdate(
        userToFollowId,
        { $push: { followers: req.userId } },
        { new: true }
      );

      updatedCurrentUser = await UserModel.findByIdAndUpdate(
        req.userId,
        { $push: { following: userToFollowId } },
        { new: true }
      );

      message = "Utilisateur suivi avec succès ✅";
    } else {
      // ➖ Se désabonner (unfollow)
      updatedTargetUser = await UserModel.findByIdAndUpdate(
        userToFollowId,
        { $pull: { followers: req.userId } },
        { new: true }
      );

      updatedCurrentUser = await UserModel.findByIdAndUpdate(
        req.userId,
        { $pull: { following: userToFollowId } },
        { new: true }
      );

      message = "Utilisateur non suivi avec succès 📴";
    }

    // ✅ 6️⃣ Retourne une réponse claire
    return res.status(200).json({
      success: true,
      message,
      currentUser: updatedCurrentUser,
      targetUser: updatedTargetUser,
    });
  } catch (error) {
    console.error("❌ Erreur dans followUnfollowUser :", error);
    return next(new HttpError(error.message || "Erreur serveur", 500));
  }
};

/**
 * Méthode de modification de l'avatar d'un utilisateur
 * POST : api/users/avatar
 * Protected
 */
const changeUserAvatar = async (req, res, next) => {
  console.log("modification de l'image de profile !")
  try {
    // ✅ Vérifie si un fichier "avatar" est présent dans la requête
    if (!req.files.avatar) {
      // Si aucun fichier n’est fourni, on renvoie une erreur 422 (unprocessable entity)
      return next(new HttpError("Please choose an image", 422));
    }

    // ✅ On récupère l’objet "avatar" depuis les fichiers envoyés
    const { avatar } = req.files;

    // ✅ Vérifie la taille du fichier (ici, max 500 ko)
    if (avatar.size > 500000) {
      return next(
        new HttpError("Profile picture too big. Should be less than 500kb", 422)
      );
    }

    // ✅ Génération d’un nom unique pour le fichier uploadé
    //    On sépare le nom du fichier et son extension, puis on ajoute un UUID
    let fileName = avatar.name;
    let splittedFilename = fileName.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];

    // ✅ Définit le chemin complet où le fichier sera temporairement enregistré sur le serveur
    const uploadPath = path.join(__dirname, "..", "uploads", newFilename);

    // ✅ avatar.mv utilise un callback, donc on le "promisifie" pour pouvoir l'utiliser avec await
    // const mv = cloudinary.utils.promisify(avatar.mv);

    // ✅ Déplace le fichier uploadé vers le dossier "uploads"
    await avatar.mv(uploadPath);

    // ✅ Upload du fichier sur Cloudinary (service de stockage d’images)
    //    On indique que c’est une ressource de type "image"
    const result = await cloudinary.uploader.upload(uploadPath, {
      resource_type: "image",
      folder: "avatars",
    });

    // ✅ Vérifie que Cloudinary a bien retourné une URL d’image valide
    if (!result.secure_url) {
      return next(new HttpError("Couldn't upload image to cloudinary", 422));
    }

    // ✅ Met à jour le champ "profilePhoto" de l'utilisateur connecté
    //    avec l'URL sécurisée retournée par Cloudinary
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId, // ID de l'utilisateur connecté
      { profilePhoto: result.secure_url }, // Nouvelle photo de profil
      { new: true } // Renvoie le document mis à jour
    );

    // ✅ Envoie la réponse au client avec le nouvel utilisateur mis à jour
    return res.status(200).json(updatedUser);
  } catch (error) {
    // ❌ Si une erreur survient à n’importe quelle étape,
    //    elle est loggée et envoyée à Express via "next()"
    console.error("🔥 Full error object:", error);
    return next(new HttpError(error.message || JSON.stringify(error), 500));
  }
};

const changeUserAvatars = async (req, res, next) => {
  try {
    if (!req.files && !req.files.avatar) {
      return next(new HttpError("Please choose an image", 422));
    }
    if (!req.userId) {
      return next(new HttpError("Authentication required", 401));
    }
    
    const avatar = req.files.avatar;
    if (avatar.size > 1024 * 1024) {
      return next(new HttpError("Avatar size too big", 422));
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(avatar.mimetype)) {
      return next(new HttpError("Invalid avatar type", 422));
    }

    const base64 = avatar.data.toString("base64");
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      { profilePhoto: base64 },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return next(new HttpError("User not found", 404));
    }

    const imageUrl = `data:${avatar.mimetype};base64,${base64}`;

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully ✅",
      user: updatedUser,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("❌ Error in changeUserAvatar:", error);
    return next(new HttpError(error.message || "Server error", 500));
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
  changeUserAvatar,
};
