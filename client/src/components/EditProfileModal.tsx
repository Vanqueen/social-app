import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import type { AppState } from '../types/app-state.types';
import axios from 'axios';
import { uiActions } from '../store/ui-slice';
import { userActions } from '../store/user-slice';

interface EditProfileModalProps {
    onSuccess: () => void;
}


const EditProfileModal = ({onSuccess}: EditProfileModalProps) => {
    const user = useSelector((state: AppState) => state?.user?.currentUser);

    const [userData, setUserData] = React.useState({ fullName: user.fullName, bio: user.bio });

    const dispatch = useDispatch();

    const id = useSelector((state: AppState) => state?.user?.currentUser?._id);
    // Récupération de l'id de l'utilisateur actuellement connecté depuis Redux

    // const getUser = async () => {
    //     try {
    //         const response = await axios.get(
    //             `${import.meta.env.VITE_API_URL}/users/${id}`,
    //             { withCredentials: true }
    //         );

    //         setUserData(response?.data?.user);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const closeModal = (e: React.MouseEvent<HTMLElement>) => {
        if ((e.target as HTMLElement).classList.contains("editProfile")) {
            dispatch(uiActions.closeEditProfileModal());
        }
    }

    const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/${id}/edit`,
                userData,
                { withCredentials: true }
            );


            dispatch(userActions.changeCurrentUser(response?.data));
            localStorage.setItem("currentUser", JSON.stringify(response?.data));

            onSuccess(); // 🔥 force refresh du parent
            
            // si succès → fermer le modal
            dispatch(uiActions.closeEditProfileModal());

        } catch (error) {
            console.log(error);
        }

    }

    const changeUserData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserData((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }


    // React.useEffect(() => {
    //     getUser();
    // }, []);


    return (
        <section
            className="editProfile"
            onClick={e => { closeModal(e) }}
        >
            <div className="editProfile__container">
                <h3>Modification de profile</h3>
                <form onSubmit={updateUser}>
                    <input
                        type="text"
                        name="fullName"
                        value={userData?.fullName}
                        onChange={changeUserData}
                        placeholder='Nom et prénoms' />
                    <textarea
                        name="bio"
                        value={userData?.bio}
                        onChange={changeUserData}
                        placeholder='Bio' />
                    <button
                        type="submit"
                        className='btn primary'>Modifier</button>
                </form>
            </div>
        </section>
    )
}

export default EditProfileModal