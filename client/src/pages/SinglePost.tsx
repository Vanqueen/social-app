import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom' //useNavigate, 
import ProfileImage from '../components/ProfileImage';
import axios from 'axios';
import TimeAgo from 'react-timeago';
import LikeDislikePost from '../components/LikeDislikePost';
import { IoMdSend, IoMdShare } from 'react-icons/io';
import { FaRegCommentDots } from 'react-icons/fa';
import BookmarksPost from '../components/BookmarksPost';
import PostComment from '../components/PostComment';
import type { CommentType } from '../types/comment.types';
import type { PostType } from '../types/post.types';

const SinglePost = () => {
  const { id } = useParams();
 
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [comment, setComment] = useState<string>("");
  // const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/${id}`,
          { withCredentials: true }
        );

        setPost(response?.data);
      } catch (error) {
        console.log(error);
      }
    }
    getPost();
  }, [id]);

  const deleteComment = async (commentId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}/delete`,
        { withCredentials: true }
      );
      setComments(comments.filter(c => c._id !== commentId));
      // navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  const createComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${id}`,
        { comment },
        { withCredentials: true }
      );
      const newComment = response?.data?.comment;
      setComments([newComment, ...comments]);
      setComment("");
      // navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/comments/${id}/post-comment`,
          { withCredentials: true }
        );
        setComments(response?.data?.comments);
      } catch (error) {
        console.log(error);
      }
    }
    getComments();
  }, [id]);

  return (
    <section className='singePost'>
      <header className='feed__header'>
        <ProfileImage image={post?.creator?.profilePhoto || ''} />
        <div className='feed__header-details'>
          <h4>{post?.creator?.fullName}</h4>
          <small>{post?.createdAt ? <TimeAgo date={post.createdAt} /> : 'Date inconnue'}</small>
        </div>
      </header>
      <div className="feed__body">
        <p>{post?.body}</p>
        <div className="feed__images">
          <img src={post?.image} alt="" />
        </div>
      </div>
      <footer className='feed__footer'>
        <div>
          {post?.likes && <LikeDislikePost post={post} />}
          <button className='feed__footer-comments'><FaRegCommentDots /></button>
          <button className='feed__footer-share'><IoMdShare /></button>
        </div>
        {post && <BookmarksPost post={post} />}
      </footer>

      <ul className='singlePost__comments'>
        <form className='singlePost__comments-form' onSubmit={createComment}>
          <textarea
            placeholder='Entrez votre commentaire...'
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button
            type="submit"
            className='singlePost__comments-btn'
          ><IoMdSend /></button>
        </form>
        {
          comments?.map(comment => <PostComment
            key={comment?._id}
            comment={comment}
            onDeleteComment={deleteComment}
          />)
        }
      </ul>
    </section>
  )
}

export default SinglePost
