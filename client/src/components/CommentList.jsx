import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'

const CommentList = ({ props }) => {
    const user = useSelector(state => state.user)
    const { data, loading, error } = useFetch(
        `${getEnv('VITE_API_BASE_URL')}/comment/get/${props.blogid}`, 
        {
            method: 'get',
            credentials: 'include',
        }
    )

    const totalComments = props.newComment 
        ? (data?.comments?.length || 0) + 1 
        : (data?.comments?.length || 0);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-muted rounded w-24"></div>
                            <div className="h-3 bg-muted rounded w-full"></div>
                            <div className="h-3 bg-muted rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const CommentItem = ({ comment, isNew = false }) => (
        <div className={`flex gap-4 p-4 rounded-xl transition-colors ${isNew ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'}`}>
            <Avatar className="w-10 h-10 ring-2 ring-primary/20 flex-shrink-0">
                <AvatarImage src={comment?.user?.avatar || user?.user?.avatar || usericon} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {(comment?.user?.name || user?.user?.name)?.charAt(0) || 'U'}
                </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-foreground">
                        {comment?.user?.name || user?.user?.name}
                    </span>
                    {comment?.user?.role === 'admin' && (
                        <Badge className="bg-gradient-primary text-white text-[10px] border-0 py-0 h-5">
                            Admin
                        </Badge>
                    )}
                    {isNew && (
                        <Badge variant="outline" className="text-primary border-primary/30 text-[10px] py-0 h-5">
                            New
                        </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                        {moment(comment?.createdAt || new Date()).fromNow()}
                    </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                    {comment?.comment}
                </p>
            </div>
        </div>
    )

    return (
        <div>
            {/* Comment Count */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                <span className="text-lg font-display font-semibold text-foreground">
                    {totalComments}
                </span>
                <span className="text-muted-foreground">
                    {totalComments === 1 ? 'Comment' : 'Comments'}
                </span>
            </div>
            
            {/* Comments */}
            <div className="space-y-2">
                {/* New Comment (optimistic update) */}
                {props.newComment && (
                    <CommentItem comment={props.newComment} isNew={true} />
                )}
                
                {/* Existing Comments */}
                {data?.comments?.length > 0 ? (
                    data.comments.map(comment => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))
                ) : !props.newComment && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            No comments yet. Be the first to share your thoughts!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentList
