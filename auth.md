Parfait boss 😎🔥
Avec **ce modèle de refresh token**, on peut faire un **logout PRO** :
➡️ supprimer le refresh token en base
➡️ supprimer les cookies
➡️ empêcher toute régénération de token

Et je vais aussi te donner le **service complet**, **controller**, et **route**.

---

# ✅ 1. SERVICE — logoutUser basé sur ton modèle

Tu stockes :

* userId
* jti
* **tokenHash** (excellente pratique 👑)
* expiresAt
* userAgent

Donc pour invalider un refresh token → **on supprime l’entrée matching jti**.

Voici la méthode :

```js
// services/users.service.js
const RefreshTokenModel = require("../models/refreshToken.model");
const HttpError = require("../utils/HttpError");

class UserService {

    static async logoutUser(jti) {
        if (!jti) return;

        // On supprime le refreshToken correspondant
        const deleted = await RefreshTokenModel.findOneAndDelete({ jti });

        if (!deleted) {
            // Ce n’est pas une erreur : peut déjà être supprimé / expiré
            console.warn("RefreshToken déjà supprimé ou invalide :", jti);
        }

        return true;
    }

}

module.exports = UserService;
```

---

# ✅ 2. CONTROLLER — logoutUser basé sur ton système

Ton refreshToken est stocké dans un cookie sous forme :

```js
{
  jti: "...",
  token: "..."
}
```

Alors :
➡️ On parse le cookie
➡️ On supprime en base
➡️ On nettoie les cookies

```js
// controllers/users.controller.js
const UserService = require("../services/users.service");
const HttpError = require("../utils/HttpError");

const logoutUser = async (req, res, next) => {
    try {
        // Cookies présents ?
        const refreshCookie = req.cookies?.refreshToken
            ? JSON.parse(req.cookies.refreshToken)
            : null;

        const jti = refreshCookie?.jti;

        // On invalide le refresh token en base
        if (jti) {
            await UserService.logoutUser(jti);
        }

        // Suppression des cookies (access & refresh)
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "strict",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Déconnexion effectuée avec succès."
        });

    } catch (error) {
        console.error("Erreur lors du logout :", error);
        return next(new HttpError("Erreur lors de la déconnexion", 500));
    }
};

module.exports = {
    logoutUser
};
```

---

# ✅ 3. ROUTE logout (protégée ou non ?)

➡️ Si tu veux obliger l’utilisateur à être connecté :

```js
router.post("/logout", auth, logoutUser);
```

➡️ Si tu veux qu’il puisse se logout même si l’AT est expiré (souvent mieux) :

```js
router.post("/logout", logoutUser);
```

👑 *Recommandation PRO : permettre le logout même sans accessToken valide.*

---

# 🔒 4. Comportement complet du logout

1. Le front envoie un POST /logout

2. Le backend :
   ✔ récupère `refreshToken` dans les cookies
   ✔ extrait `jti`
   ✔ supprime en base `RefreshTokenModel.findOneAndDelete({ jti })`
   ✔ supprime les cookies HTTP-only
   ✔ renvoie un message de succès

3. Résultat :
   ✔ L'utilisateur ne peut plus rafraîchir son token
   ✔ Il ne peut plus s'authentifier
   ✔ Il est réellement déconnecté

---

# 🎁 BONUS (optionnel mais PRO)

Je peux aussi te générer :

### ✔ Un middleware **verifyRefreshToken()**

Pour gérer `/refresh` en sécurité

### ✔ La route **POST /refresh**

Pour renvoyer un nouvel accessToken + rotation du refreshToken

### ✔ Un système **anti vol de refresh tokens**

(grâce au hashing de tokenHash + userAgent, AZERTY 🔥)

### ✔ La rotation automatique (delete ancien RT + créer nouveau)

---

Dis-moi si tu veux la **route refresh** maintenant 👇🔥
