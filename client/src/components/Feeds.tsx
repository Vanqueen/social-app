// import React from 'react'
import Feed from './Feed'
import type { PostType } from '../types/post.types'
 
interface FeedsProps {
  posts: PostType[];
  // onSetPosts: (posts: string) => void;
  onDeletePost: (postId: string) => void;
}
const Feeds = ({posts, onDeletePost}: FeedsProps) => {
  return (
    <div className='feeds'>
        {
        posts?.length < 1
        ? <p className='center'>Aucun post pour le moment...</p>
        : posts?.map(
            post => <Feed key={post?._id} post={post} onDeletePost={onDeletePost} />
        )
        }
    </div>
  )
}
 
export default Feeds