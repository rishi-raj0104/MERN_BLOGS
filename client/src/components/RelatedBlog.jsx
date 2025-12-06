import { getEnv } from '@/helpers/getEnv'
import { RouteBlogDetails } from '@/helpers/RouteName'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const RelatedBlog = ({ props }) => {
    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-related-blog/${props.category}/${props.currentBlog}`, {
        method: 'get',
        credentials: 'include',
    })

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-20 h-14 bg-muted rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-muted rounded w-full"></div>
                            <div className="h-3 bg-muted rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    
    return (
        <div className="space-y-4">
            {data && data.relatedBlog?.length > 0 ? (
                data.relatedBlog.map(blog => (
                    <Link 
                        key={blog._id} 
                        to={RouteBlogDetails(props.category, blog.slug)}
                        className="flex items-center gap-3 group p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <div className="relative overflow-hidden w-20 h-14 rounded-lg flex-shrink-0">
                            <img 
                                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110' 
                                src={blog.featuredImage}
                                alt={blog.title}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className='line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors'>
                                {blog.title}
                            </h4>
                        </div>
                        <FiArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all flex-shrink-0" />
                    </Link>
                ))
            ) : (
                <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">No related posts found</p>
                </div>
            )}
        </div>
    )
}

export default RelatedBlog
