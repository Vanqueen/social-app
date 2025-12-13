import React from 'react'
import { useSelector } from 'react-redux';
import type { AppState } from '../types/app-state.types';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import ProfileImage from './ProfileImage';
import TimeAgo from 'react-timeago';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoMdShare } from 'react-icons/io';
import LikeDislikePost from '../pages/LikeDislikePost';
import TrimText from '../helpers/TrimText';
import BookmarksPost from './BookmarksPost';

const Feed = ({post}: any) => {
    console.log("post :", post);
    const [creator, setCreator] = React.useState({});
    // const token = useSelector((state: AppState) => state?.user?.currentUser?.accessToken);
    const [showFeedHeaderMenu, setShowFeedHeaderMenu] = React.useState(false);
    const userId = useSelector((state: AppState) => state?.user?.currentUser?.user?._id);

    const location = useLocation();


    const getPostCreator = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${post?.creator}`, {withCredentials: true});
            setCreator(response?.data?.user);
        } catch (error) {
            console.log(error);
        }
    }

    const deletePost = async () => {

    }

    const showEditPostModal = async () => {

    }


    React.useEffect(() => {
        getPostCreator();
    }, []);


  return (
    <div>
        <article className='feed'>
            <header className='feed__header'>
                <Link to={`/users/${post?.creator}`} className="feed__header-profile">
                    <ProfileImage image={creator?.profilePhoto} />
                    <div className='feed__header-details'>
                        <h4>{creator?.fullName}</h4>
                        <small><TimeAgo date={post?.createdAt} /></small>
                    </div>
                </Link>
                {showFeedHeaderMenu 
                && userId == post?.crator 
                && location.pathname.includes("users") 
                && <menu className='feed__headermenu'>
                        <button onClick={showEditPostModal}>Edit</button>
                        <button onClick={deletePost}>Delete</button>
                   </menu>
                }
            </header>
            <Link 
            to={`posts/${post?._id}`}
            className='feed__body'>
                <p><TrimText item={post?.body} maxLength={160} /></p>
                {/* <p>{post?.body}</p> */}
                <div className='feed__images'>
                    <img src={post?.image} alt="" />
                </div>
            </Link>
            <footer className='feed__footer'>
                <div >
                    <LikeDislikePost post={post} />
                    <button className='feed__footer-comments'>
                        <Link to={`/posts/${post?._id}`}>
                            <FaRegCommentDots />
                        </Link>
                    </button>
                    <button className='feed__footer-share'>
                        <IoMdShare />
                    </button>
                </div>
                <BookmarksPost post={post}/>
            </footer>
        </article>
    </div>
  )
}



export default Feed