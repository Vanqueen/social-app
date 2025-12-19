import React from 'react'
import { useSelector } from 'react-redux';
import type { AppState } from '../types/app-state.types';
import axios from 'axios';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import type { PostType } from '../types/post.types';
import type { CurrentUser } from '../types/user.type';

interface BookmarksPostProps {
  post: PostType
}
const BookmarksPost = ({ post }: BookmarksPostProps) => {
 
  const userId = useSelector((state: AppState) => state?.user.currentUser?._id);
  const [user, setUser] = React.useState<CurrentUser | null>(null);
  const [postBookmarked, setPostBookmarked] = React.useState(false);

 
  // Charger l'utilisateur 1 seule fois (ou si userId change)
  React.useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${userId}`,
          { withCredentials: true }
        );
       
        setUser(response?.data?.user)
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) getUser();
  }, [userId]);

  // Mettre à jour postBookmarked quand user OU post change
  React.useEffect(() => {
    if (user) {
      setPostBookmarked(user.bookmarks?.includes(post?._id));
    }
  }, [user, post?._id]);

  const createBookmark = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmark`,
        { withCredentials: true }
      );

      // mettre à jour en fonction de la réponse
      const isBookmarked = response?.data?.bookmarks?.includes(post?._id);
      setPostBookmarked(isBookmarked);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button className="feed__footer-bookmark" onClick={createBookmark}>
      {postBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default BookmarksPost;
