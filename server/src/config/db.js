const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { ServerApiVersion } = require("mongodb");
const path = require("path");

// __dirname is available in CommonJS (.cjs), no need to derive it from import.meta

// Résoudre le chemin du fichier .env en fonction de l'environnement
const envFilePath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// Charger les variables d'environnement à partir du fichier (répertoire parent)
const result = dotenv.config({
    path: path.resolve(__dirname, '..', envFilePath)
});

if (result.error && process.env.NODE_ENV !== 'production') {
    console.error('Erreur lors du chargement du fichier .env :', result.error);
    process.exit(1);
} else if (result.error) {
    console.log('Fichier .env non trouvé, utilisation des variables d\'environnement du système');
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri, {
      serverApi: ServerApiVersion.v1
    });
    console.log("✅ Connecté à MongoDB avec succès");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
};

module.exports = connectDB;
