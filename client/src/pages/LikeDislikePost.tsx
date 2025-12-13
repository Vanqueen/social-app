import React from 'react'
import { useSelector } from 'react-redux';
import type { AppState } from '../types/app-state.types';
import axios from 'axios';
import { FcLike } from 'react-icons/fc';
import { FaRegHeart } from 'react-icons/fa';

const LikeDislikePost = (props) => {
  const [post, setPost] = React.useState(props.post);
  const [postLiked, setPostLiked] = React.useState<boolean>(false);
  const userId = useSelector((state: AppState) => state?.user?.currentUser?.user?._id);

  const handleLikeDislikePost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/like`,
        {withCredentials: true}
      )
      setPost(response?.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCheckIfUserLikedPost = () => {
    if(post?.likes?.includes(userId)) {
      setPostLiked(true);
    } else {
      setPostLiked(false);
    }
  }

  React.useEffect(() => {
    handleCheckIfUserLikedPost();
  }, [post]);

  
  return (
    <button className='feed__footer-comments' onClick={handleLikeDislikePost}>
      {postLiked ? <FcLike /> : <FaRegHeart />}
    </button>
  )
}

export default LikeDislikePost