// import React from 'react'
import Feed from './Feed'
import type { PostType } from '../types/post.types'
 
interface FeedsProps {
  posts: PostType[];
  onSetPosts: (posts: PostType[]) => void;
}
const Feeds = ({posts, onSetPosts}: FeedsProps) => {
  console.log(onSetPosts);
  return (
    <div className='feeds'>
        {
        posts?.length < 1
        ? <p className='center'>Aucun post pour le moment...</p>
        : posts?.map(
            post => <Feed key={post?._id} post={post} />
        )
        }
    </div>
  )
}
 
export default Feeds