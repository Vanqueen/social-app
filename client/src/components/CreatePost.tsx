import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ProfileImage from './ProfileImage';
import { SlPicture } from 'react-icons/sl';
import type { AppState } from '../types/app-state.types';

interface CreatePostProps {
  onCreatePost: (data: FormData) => void;
  error?: string;
}

const CreatePost = ({onCreatePost, error}: CreatePostProps) => {
    const [body, setBody] = useState<string>("");
    const profilePhoto = useSelector((s: AppState) => s.user?.currentUser?.profilePhoto);
    const [image, setImage] = useState<File | null>(null);

    // Fonction de création d'un post
    const createPost = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const postData = new FormData();
        postData.set('body', body);
        postData.set('image', image || "");
        onCreatePost(postData);
        setBody("");
        setImage(null)
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file  = e.target.files?.[0] ?? null;
        setImage(file);
    }

  return (
    <form action="" className="createPost" encType='multipart/form-data' onSubmit={createPost}>
        {error && <p className='createPost__error-message'>{error}</p>}
        <div className="createPost__top">
            <ProfileImage image={profilePhoto} />
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder='Partagez avec nous votre réflexion' />
        </div>
        <div className="createPost__bottom">
            <span></span>
            <div className="createPost__actions">
                <label htmlFor="image"><SlPicture /></label>
                <input type="file" id='image' onChange={handleFile} name='image' />
                <button type='submit'>Post</button>
            </div>
        </div>
    </form>
  )
}

export default CreatePost