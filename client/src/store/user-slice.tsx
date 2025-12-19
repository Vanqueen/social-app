import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  try {
    const row = localStorage.getItem("currentUser");
    if (row) {
      return JSON.parse(row);
    }
    return null;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return null;
  }
};

const getStoredToken = () => {
  return localStorage.getItem("accessToken");
};

/**
 * Creation d'un slice Redux pour la gestion des données utilisateur de notre application
 */
const userSlice = createSlice({
  name: "user", //Nom du slice
  // l'état initial
  initialState: {
    // On récupère l'utilisateur stocké dans le localStorage
    currentUser: getStoredUser(), //Utilisateur actuellement connecté
    socket: null, //Socket pour la communication en temps réel
    onlineUsers: [], //Liste des utilisateurs en ligne
    accessToken: getStoredToken(),
  },
  //
  reducers: {
    changeCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
