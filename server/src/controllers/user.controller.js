

/**
 * Enregistrement d'un utilisateur
 * POST : api/users/register
 */
const registerUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}

/**
 * Methode de connexion
 * POST : api/users/login
 */
const loginUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        
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