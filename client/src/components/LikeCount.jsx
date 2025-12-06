import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { apiFetch } from '@/helpers/api';
import { useFetch } from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react'
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useSelector } from 'react-redux';

const LikeCount = ({ props }) => {
    const [likeCount, setLikeCount] = useState(0)
    const [hasLiked, setHasLiked] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const user = useSelector(state => state.user)

    // Build the URL - only include userid if user is logged in
    const likeUrl = user && user.isLoggedIn 
        ? `${getEnv('VITE_API_BASE_URL')}/blog-like/get-like/${props.blogid}/${user.user._id}`
        : `${getEnv('VITE_API_BASE_URL')}/blog-like/get-like/${props.blogid}`;
    
    const { data: blogLikeCount, loading, error } = useFetch(
        likeUrl, 
        {
            method: 'get',
            credentials: 'include',
        }
    )
 
    useEffect(() => {
        if (blogLikeCount) {
            setLikeCount(blogLikeCount.likecount)
            setHasLiked(blogLikeCount.isUserliked)
        }
    }, [blogLikeCount])

    const handleLike = async () => {
        try {
            if (!user.isLoggedIn) {
                return showToast('error', 'Please sign in to like this post')
            }
            
            // Trigger animation
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 300)

            const response = await apiFetch(`${getEnv('VITE_API_BASE_URL')}/blog-like/do-like`, {
                method: 'POST',
                body: JSON.stringify({ user: user.user._id, blogid: props.blogid })
            })

            if (!response.ok) {
                showToast('error', response.statusText)
                return
            }
            
            const responseData = await response.json()
            setLikeCount(responseData.likecount)
            setHasLiked(!hasLiked)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
        <button 
            onClick={handleLike} 
            type='button' 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                hasLiked 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-500' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
        >
            <span className={`transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
                {hasLiked ? (
                    <FaHeart className="w-5 h-5 text-red-500" />
                ) : (
                    <FiHeart className="w-5 h-5" />
                )}
            </span>
            <span className="font-medium text-sm">{likeCount}</span>
        </button>
    )
}

export default LikeCount
