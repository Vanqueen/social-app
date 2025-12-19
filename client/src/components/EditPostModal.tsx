/* eslint-disable */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppState } from '../types/app-state.types';
import axios from 'axios';
import { uiActions } from '../store/ui-slice';

interface EditPostModalProps {
    onUpdatePost: (data: FormData, postId: string) => Promise<void>;
    onSuccess: () => void
}


const EditPostModal = ({onUpdatePost, onSuccess}: EditPostModalProps) => {
    const editPostId = useSelector((state: AppState) => state?.ui?.editPostId);
    const [body, setBody] = React.useState("");
    const dispatch = useDispatch();
    
    
    const getPost = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/posts/${editPostId}`,
                { withCredentials: true }
            );

            setBody(response?.data?.body);

        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => { getPost() }, []);

    
    const updatePost = async () => {
        const postData = new FormData();
        postData.set("body", body);
        onUpdatePost(postData, editPostId);
        onSuccess();
        dispatch(uiActions?.closeEditPostModal());
    }

    const closeEditPostModal = async (e: React.MouseEvent<HTMLElement>) => {
        if((e.target as HTMLElement).classList.contains('editPost')){
            dispatch(uiActions?.closeEditPostModal());
        }
    }


    return (
        <form 
        className='editPost'
        onSubmit={updatePost}
        onClick={closeEditPostModal}
        >
            <div className="editPost__container">
                <textarea 
                value={body} 
                onChange={(e) => setBody(e.target.value)}
                placeholder='A quoi pensez-vous ?!' autoFocus />
                <button 
                type="submit"
                className='btn primary'>Modifier Post</button>
            </div>
        </form>
    )
}

export default EditPostModal