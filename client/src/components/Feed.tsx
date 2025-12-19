import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import type { AppState } from '../types/app-state.types';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import ProfileImage from './ProfileImage';
import TimeAgo from 'react-timeago';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoMdShare } from 'react-icons/io';
import LikeDislikePost from './LikeDislikePost';
import TrimText from '../helpers/TrimText';
import BookmarksPost from './BookmarksPost';
import type { PostType } from '../types/post.types';
import type { UserInfo } from '../types/user.type';
import { HiDotsHorizontal } from 'react-icons/hi';
import { uiActions } from '../store/ui-slice';

const Feed = ({post, onDeletePost}: {post: PostType, onDeletePost: (postId: string) => void} ) => {
    const [creator, setCreator] = useState<UserInfo | null>(null);
    // const token = useSelector((state: AppState) => state?.user?.currentUser?.accessToken);
    const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false);
    const userId = useSelector((state: AppState) => state?.user?.currentUser?._id);

    const location = useLocation();
    const dispatch = useDispatch();


    const getPostCreator = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${post?.creator}`, {withCredentials: true});
            setCreator(response?.data?.user);
        } catch (error) {
            console.log(error);
        }
    }, [post]);

    const closeFeedHeaderMenu = () => {
        setShowFeedHeaderMenu(false);
    }

    const deletePost = async () => {
        onDeletePost(post?._id);
        closeFeedHeaderMenu();
    }
    
    const showEditPostModal = async () => {
        dispatch(uiActions.openEditPostModal(post?._id));
    }


    React.useEffect(() => {
        getPostCreator();
    }, [getPostCreator]);


  return (
    <div>
        <article className='feed'>
            <header className='feed__header'>
                <Link to={`/users/${post?.creator}`} className="feed__header-profile">
                    <ProfileImage image={creator?.profilePhoto || ''} />
                    <div className='feed__header-details'>
                        <h4>{creator?.fullName}</h4>
                        <small>{post?.createdAt ? <TimeAgo date={post.createdAt} /> : 'Date inconnue'}</small>
                    </div>
                </Link>
                {showFeedHeaderMenu 
                && userId == post?.creator
                && location.pathname.includes("users") 
                && <menu className='feed__header-menu'>
                        <button onClick={showEditPostModal}>Edit</button>
                        <button onClick={deletePost}>Delete</button>
                   </menu>
                }
                {
                    userId == post?.creator
                    && location.pathname.includes("users")
                    && <button onClick={() => setShowFeedHeaderMenu(!showFeedHeaderMenu)}>
                        <HiDotsHorizontal />
                    </button>
                }
            </header>
            <Link 
            to={`posts/${post?._id}`}
            className='feed__body'>
                <p><TrimText item={post?.body} maxLength={160} /></p>
                <p>{post?.body}</p>
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