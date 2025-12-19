/* eslint-disable */
// import React from 'react'

import React, { useState } from "react";
import UserProfile from "../components/UserProfile"
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { AppState } from "../types/app-state.types";
import type { CurrentUser } from "../types/user.type";
import HeaderInfo from "../components/HeaderInfo";
import Feed from "../components/Feed";
import EditPostModal from "../components/EditPostModal";
import type { PostType } from "../types/post.types";
import EditProfileModal from "../components/EditProfileModal";

const Profile = () => {
    const [user, setUser] = useState<CurrentUser | null>(null);
  const { id: userId } = useParams();
  const [userPosts, setUserPosts] = useState<PostType[] | [] >([]);
  const [isLoading, setIsLoading] = useState(false);
  const editPostModalOpen = useSelector((state: AppState) => state?.ui?.editPostModalOpen);
  const editProfileModalOpen = useSelector((state: AppState) => state?.ui?.editProfileModalOpen);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fonction asynchrone pour récupérer un utilisateur depuis l'API
  // const getUser = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_URL}/users/${userId}`,
  //       { withCredentials: true }
  //     );

  //     // Mise à jour de l'utilisateur affiché
  //     setUser(response?.data?.user);
  //   } catch (error) {
  //     // Gestion des erreurs API
  //     console.log(error);
  //   }
  // };

  const getUserPosts = async () => {
    console.log(isLoading);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/posts`,
        { withCredentials: true }
      );

      setUser(response?.data);
      setUserPosts(response?.data?.posts);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  const deletePost = async (postId: string) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/delete`,
        { withCredentials: true }
      );
      console.log("response", response?.data?.body);
      setUserPosts(userPosts?.filter(p => p?._id != postId));
    } catch (error) {
      console.log(error);
    }
  }

  const updatePost = async (data: FormData, postId: string) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/edit`,
        data,
        { withCredentials: true }
      );


      if (response?.status == 200) {
        const updatedPost = response?.data;
        setUserPosts(userPosts?.map(
          post => {
            if (updatedPost?._id.toString() == post?._id.toString()) {
              post.body == updatedPost.body
            }

            return post;
          }
        ))
      }
    } catch (error) {
      console.log(error);
    }
  }

  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  
  React.useEffect(() => {
    // Appel de la fonction de récupération
    // getUser();
    getUserPosts();
  }, [userId, refreshKey]);
  
  return (
    <section>
      <UserProfile />
      <HeaderInfo text={`${user?.fullName}'s posts`} />
      <section className='profile__posts'>
        {
          userPosts?.length < 1
            ? <p className='center'>Aucun post à partager pour le moment</p>
            : userPosts?.map(
              post => <Feed
                key={post?._id}
                post={post}
                onDeletePost={deletePost}
              />
            )
        }
      </section>
      {editPostModalOpen && <EditPostModal
      onUpdatePost={updatePost} 
      onSuccess={forceRefresh}
      />}
      {editProfileModalOpen && <EditProfileModal onSuccess={forceRefresh}/>}
    </section>
  )
}

export default Profile
