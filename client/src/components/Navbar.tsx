// Navbar.tsx

import { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import type { AppState } from "../types/app-state.types";
// AppState
const Navbar = () => {
  const navigate = useNavigate();
  // const currentUser = useSelector((s: AppState) => s.user?.currentUser);
  const token = useSelector((s: AppState) => s.user?.accessToken);
  
  const userId = useSelector((s: AppState) => s.user?.currentUser?._id);
  const fullName = useSelector((s: AppState) => s.user?.currentUser?.fullName);
  const profilePhoto = useSelector((s: AppState) => s.user?.currentUser?.profilePhoto);

  useEffect(() => {
    if (token === undefined) return;
    if(!token){
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <nav className="navbar">
      <div className="container navbar__container">
        <Link to="/" className="navbar__logo">FaceMatch</Link>
        <form action="" className="navbar__search">
          <input type="search" placeholder="Recherche" />
          <button type="submit"><CiSearch /></button>
        </form>
        <div className="navbar__right">
          <span>{fullName}</span>
          <Link to={`/users/${userId}`} className="navbar__profile">
            <ProfileImage image={profilePhoto} />
          </Link>
          {
            token
              ? <Link to="/login">Déconnexion</Link>
              : <Link to="/login">Connexion</Link>
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar
