import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { FiMessageCircle } from "react-icons/fi";

const CommentCount = ({ props }) => {
    const { data, loading, error } = useFetch(
        `${getEnv('VITE_API_BASE_URL')}/comment/get-count/${props.blogid}`, 
        {
            method: 'get',
            credentials: 'include',
        }
    )

    return (
        <div className='flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300'>
            <FiMessageCircle className="w-5 h-5" />
            <span className="font-medium text-sm">
                {loading ? '...' : data?.commentCount || 0}
            </span>
        </div>
    )
}

export default CommentCount
