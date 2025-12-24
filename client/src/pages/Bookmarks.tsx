import axios from 'axios';
import { useEffect, useState } from 'react'
import Feed from '../components/Feed';
import FeedSkeleton from '../components/FeedSkeleton';
import Head from '../components/Head';
import type { PostType } from '../types/post.types';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    const getBookemarks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/bookmarks`,
          { withCredentials: true }
        );
        setBookmarks(response?.data?.bookmarks);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    getBookemarks();
  })

  const deleteBookmark = (postId: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark._id !== postId));
  };

  return (
    <section>
      <Head title="Mes livres favoris" />
      {isLoading 
      ? <FeedSkeleton /> 
      : bookmarks?.length < 1  
      ? <p className="center">Aucun favoris pour le moment !</p>
      : bookmarks?.map(bookmark => <Feed key={bookmark?._id} post={bookmark} onDeletePost={deleteBookmark} />)
    }
    </section>
  )
}

export default Bookmarks