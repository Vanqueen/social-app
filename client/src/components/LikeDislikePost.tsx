/* eslint-disable */

import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { AppState } from '../types/app-state.types';
import axios from 'axios';
import { FcLike } from 'react-icons/fc';
import { FaRegHeart } from 'react-icons/fa';
import type { PostType } from '../types/post.types';

interface LikeDislikePostProps {
  post: PostType;
}
const LikeDislikePost = ({post}: LikeDislikePostProps) => {

  const [postData, setPostData] = useState(post);
  const [postLiked, setPostLiked] = useState<boolean>(false);
  const userId = useSelector((state: AppState) => state?.user?.currentUser?.userInfo?._id);

  const handleLikeDislikePost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${postData?._id}/like`,
        {withCredentials: true}
      )
      setPostData(response?.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCheckIfUserLikedPost = useCallback(() => {
    if(postData?.likes?.includes(userId)) {
      setPostLiked(true);
    } else {
      setPostLiked(false);
    }
  }, [postData, userId])

  useEffect(() => {
    handleCheckIfUserLikedPost();
  }, [postData, handleCheckIfUserLikedPost]);

  
  return (
    <button className='feed__footer-comments' onClick={handleLikeDislikePost}>
      {postLiked ? <FcLike /> : <FaRegHeart />}
    </button>
  )
}

export default LikeDislikePost