/* eslint-disable */
// UserProfile.tsx

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // useNavigate, 
import type { CurrentUser } from "../types/user.type";
import type { AppState } from "../types/app-state.types";
import { LuUpload } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { uiActions } from "../store/ui-slice";
import { userActions } from "../store/user-slice";


const UserProfile = () => {
    // Récupération de l'id de l'utilisateur pour lequel on visite la page
    const {id: userId} = useParams();
    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const configPath = import.meta.env.VITE_API_URL;

    // State pour le stockage des infos de l'utilisateur pour lequel on visite la page
    const [user, setUser] = useState<CurrentUser | null>(null);

    const loggedInUserId = useSelector((state: AppState) => state?.user?.currentUser?._id)

    // State pour suivre si l'utilisateur connecté suit l'utilisateur pour lequel on visite la page
    const [followsUser, setFollowsUser] = useState(
        user?.followers?.includes(loggedInUserId)
    );

    // Récupération des données de l'utilisateur connecté
    const currentUser = useSelector((state: AppState) => state?.user?.currentUser);

    // Indique si l'utilisateur a interagi avec l'avatar
    const [avatarTouched, setAvatarTouched] = useState(false);

    // State contenant le fichier de la nouvelle photo de profil
    const [avatar, setAvatar] = useState<File | null>(null);

    const getUser = async () => {
        try {
            const response = await axios.get(
                `${configPath}/users/${userId}`, 
                {withCredentials: true}
            );
        setUser(response?.data?.user);
        } catch (error) {
            console.log("Erreur lors de la récupération des données de l'utilisateur :", error)
        }
    }

    // Gestion du changement de photo de profil
    const changeAvatarHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche le rechargement de la page
        setAvatarTouched(true);
 
        // Si aucun fichier n'est sélectionné, on arrête la fonction
        if(!avatar) return;
 
        try {
            // Création d'un FormData pour l'envoi du fichier
            const postData = new FormData();
            postData.set("avatar", avatar);
 
            // Envoi de la nouvelle photo au serveur
            const response = await axios.post(
                `${configPath}/users/avatar`,
                postData,
                { withCredentials: true }
            );
         
            // Mise à jour de la photo de profil dans Redux
            dispatch(
                userActions.changeCurrentUser({
                    ...currentUser,
                    profilePhoto: response?.data?.profilePhoto
                })
            );

            setUser(prev => prev ? {...prev, profilePhoto: response?.data?.profilePhoto} : null);
            setAvatarTouched(false);
 
            // navigate(0); // Rechargement de la page
        } catch (error) {
            // Gestion des erreurs
            console.log(error);
        }
    };

    // Ouverture du modal d'édition du profil
    const openEditProfileModal =  () => {
        dispatch(uiActions.openEditProfileModal());
    };

    // Fonction pour suivre / ne plus suivre un utilisateur (à implémenter)
    const followUnfollowUser = async () => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/${userId}/follow-unfollow`,
                {},
                {withCredentials: true}
            );
            setFollowsUser(response?.data?.targetUser?.followers?.includes(loggedInUserId));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, [userId]);

  return (
    <section className="profile">
        <div className="profile__container">
 
                {/* Formulaire de modification de la photo de profil */}
                <form
                    className="profile__image"
                    onSubmit={e => changeAvatarHandler(e)}
                    encType='multipart/form-data'
                >
                    {/* Affichage de la photo de profil */}
                    <img src={user?.profilePhoto} alt="" />
 
                    {/* Bouton upload ou validation selon l'état */}
                    {!avatarTouched ?
                        <label htmlFor="avatar" className='profile__image-edit'>
                            <span><LuUpload /></span>
                        </label> :
                        <button type="submit" className='profile__image-btn'>
                            <FaCheck />
                        </button>
                    }
                    {/* Input caché pour la sélection du fichier */}
                   <input
                    // {userId == user?._id && <input
                        id="avatar"
                        type="file"
                        name="avatar"
                        onChange={e => {
                            setAvatar(e.target.files?.[0] ?? null);
                            setAvatarTouched(true);
                        }}
                        accept='png, jpg, jpeg'
                    />
                    {/* />} */}
                </form>
 
                {/* Informations principales de l'utilisateur */}
                <h4>{user?.fullName}</h4>
                <small>{user?.email}</small>
 
                {/* Statistiques de l'utilisateur */}
                <ul className='profile__follows'>
                    <li>
                        <h4>{user?.following?.length}</h4>
                        <small>Following</small>
                    </li>
                    <li>
                        <h4>{user?.followers?.length}</h4>
                        <small>Followers</small>
                    </li>
                    <li>
                        <h4>0</h4>
                        <small>Likes</small>
                    </li>
                </ul>
 
                {/* Actions possibles sur le profil */}
                <div className='profile__actions-wrapper'>
                    {user?._id == loggedInUserId
                        ? <button className='btn' onClick={openEditProfileModal}>Edit Profile</button>
                        : <button onClick={followUnfollowUser} className='btn dark'>
                            {followsUser ? "Unfollow" : "Follow"}
                          </button>
                    }
 
                    {/* Lien vers la messagerie si ce n'est pas son propre profil */}
                    {user?._id != loggedInUserId &&
                        <Link to={`/messages/${user?._id}`} className="btn default">
                            Message
                        </Link>
                    }
                </div>
 
                {/* Biographie de l'utilisateur */}
                <article className='profile__bio'>
                    <p>{user?.bio}</p>
                </article>
 
            </div>
    </section>
  )
}

export default UserProfile
