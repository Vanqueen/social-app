// Register.tsx
import React, { useState } from "react";
import type { CreateUser } from "../types/user.type";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Données utiles pour la création d'un utilisateur
 * fullName
 * email
 * password
 * confirmPassword
 */

const Register = () => {
  const [userData, setUserData] = useState<CreateUser>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  };

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, userData);
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      let msg = "";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data.message;
      } else if (error instanceof Error) {
        msg = error.message;
      } else {
        msg = "Une erreur inconnue est survenue";
      }
      setError(msg);
      console.error("Erreur lors de l'inscription de l'utilisateur :", error);
    }
  }

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Inscription</h2>
        <form onSubmit={e => registerUser(e)}>
          {error && <p className="form__error-message">Une erreur s'est produite</p>}
          <input type="text" name="fullName" placeholder="Nom complet" onChange={e => changeInputHandler(e)} autoFocus />
          <input type="email" name="email" placeholder="Email" onChange={e => changeInputHandler(e)} />
          <div className="password__controller">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Mot de passe" onChange={e => changeInputHandler(e)} />
            <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
          </div>
          <div className="password__controller">
            <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirmez le mot de passe" onChange={e => changeInputHandler(e)} />
            <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
          </div>
          <p>Vous avez déjà un compte ? <Link to="/login">Connexion</Link></p>
          <button type="submit" className="btn primary">Inscription</button>
        </form>
      </div>
    </section>
  );
};

export default Register;
