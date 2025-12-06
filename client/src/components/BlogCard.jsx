import React from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiClock, FiArrowRight } from "react-icons/fi";
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { RouteBlogDetails } from '@/helpers/RouteName'

// Calculate reading time from blog content
const calculateReadingTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime < 1 ? 1 : readingTime;
}

const BlogCard = ({ props, index = 0 }) => {
    const readingTime = calculateReadingTime(props.blogContent);
    
    return (
        <Link 
            to={RouteBlogDetails(props.category?.slug, props.slug)}
            className="group block animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <Card className="overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-all duration-500 hover-lift h-full">
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[16/10]">
                    <img 
                        src={props.featuredImage} 
                        alt={props.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 dark:bg-black/70 text-foreground backdrop-blur-sm border-0 font-medium">
                            {props.category?.name || 'Uncategorized'}
                        </Badge>
                    </div>
                    
                    {/* Admin Badge */}
                    {props.author?.role === 'admin' && (
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-gradient-primary text-white border-0 font-medium shadow-soft">
                                Admin
                            </Badge>
                        </div>
                    )}
                    
                    {/* Read More Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center">
                            <FiArrowRight className="w-5 h-5 text-foreground" />
                        </div>
                    </div>
                </div>
                
                <CardContent className="p-5">
                    {/* Author & Meta */}
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-3'>
                            <Avatar className="w-9 h-9 ring-2 ring-primary/20">
                                <AvatarImage src={props.author?.avatar || usericon} />
                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                    {props.author?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm text-foreground">{props.author?.name}</span>
                        </div>
                    </div>
                    
                    {/* Title */}
                    <h2 className='text-xl font-display font-bold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors duration-300'>
                        {props.title}
                    </h2>
                    
                    {/* Date & Reading Time */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className='flex items-center gap-1.5'>
                            <FaRegCalendarAlt className="w-3.5 h-3.5" />
                            {moment(props.createdAt).format('MMM DD, YYYY')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <FiClock className="w-3.5 h-3.5" />
                            {readingTime} min read
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default BlogCard
