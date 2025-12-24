/* eslint-disable */
// import React from 'react'

import { useEffect, useState } from "react"
import CreatePost from "../components/CreatePost";
import axios from "axios";
import type { PostType } from "../types/post.types";
// import { useSelector } from "react-redux";
import Feeds from "../components/Feeds";
// import type { AppState } from "../types/app-state.types";

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  // const [isLoading, setisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  // const token = useSelector((s: AppState) => s.user?.currentUser?.accessToken);

  const getPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        withCredentials: true,
      });
      const posts = response?.data;
      setPosts(posts)
    } catch (error) {
      console.log(error);
    }
  }

  const deletePost = (postId: string) => {
    setPosts(posts.filter(post => post._id !== postId));
  };


  useEffect(() => {
    getPosts();
  }, [setPosts])

  const createPost = async (data: FormData) => {
    setError("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/create`, data, {
        withCredentials: true,
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      });
      const newPost = response?.data;
      setPosts([newPost, ...posts]);
    } catch (error: any) {
      setError(error?.response?.data?.message)
    }
  }

  return (
    <section className="mainArea">
      <CreatePost onCreatePost={createPost} error={error} /> 
      <Feeds posts={posts} onDeletePost={deletePost} />
    </section>
  )
}

export default Home
