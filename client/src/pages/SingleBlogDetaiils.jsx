import Comment from "@/components/Comment";
import CommentCount from "@/components/CommentCount";
import LikeCount from "@/components/LikeCount";
import Loading from "@/components/Loading";
import RelatedBlog from "@/components/RelatedBlog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import { decode } from "entities";
import moment from "moment";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { FiCalendar, FiClock, FiArrowLeft, FiShare2, FiBookmark } from "react-icons/fi";
import { RouteBlogByCategory, RouteIndex } from "@/helpers/RouteName";
import usericon from '@/assets/images/user.png';

// Calculate reading time from blog content
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime < 1 ? 1 : readingTime;
}

const SingleBlogDetails = () => {
  const { blog, category } = useParams();

  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-blog/${blog}`,
    {
      method: "get",
      credentials: "include",
    },
    [blog, category]
  );

  if (loading) return <Loading />;
  
  if (!data?.blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-display font-bold text-foreground mb-4">
          Blog not found
        </h2>
        <p className="text-muted-foreground mb-6">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to={RouteIndex}>
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  const readingTime = calculateReadingTime(data.blog.blogContent);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 lg:py-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          asChild 
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <Link to={RouteIndex}>
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to all posts
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Main Content */}
        <article className="flex-1 lg:max-w-3xl min-w-0">
          {/* Header */}
          <header className="mb-8 animate-fade-in-up">
            {/* Category Badge */}
            <Link to={RouteBlogByCategory(data.blog.category?.slug)}>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 font-medium mb-4">
                {data.blog.category?.name || 'Uncategorized'}
              </Badge>
            </Link>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-6 break-words">
              {data.blog.title}
            </h1>
            
            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                  <AvatarImage src={data.blog.author?.avatar || usericon} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {data.blog.author?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground">{data.blog.author?.name}</p>
                  {data.blog.author?.role === 'admin' && (
                    <Badge variant="outline" className="text-xs bg-gradient-primary text-white border-0">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="w-4 h-4" />
                  {moment(data.blog.createdAt).format("MMM DD, YYYY")}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock className="w-4 h-4" />
                  {readingTime} min read
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-muted"
                  title="Share"
                >
                  <FiShare2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-muted"
                  title="Bookmark"
                >
                  <FiBookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>
          
          {/* Featured Image */}
          {data.blog.featuredImage && (
            <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative overflow-hidden rounded-2xl shadow-medium">
                <img 
                  src={data.blog.featuredImage} 
                  alt={data.blog.title}
                  className="w-full h-auto object-cover max-h-[500px]" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Blog Content */}
          <div 
            className="blog-content prose prose-lg max-w-none animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
            dangerouslySetInnerHTML={{
              __html: decode(data.blog.blogContent) || "",
            }}
          />
          
          {/* Engagement Stats */}
          <div className="flex items-center gap-6 py-8 mt-8 border-t border-b border-border animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <LikeCount props={{ blogid: data.blog._id }} />
            <CommentCount props={{ blogid: data.blog._id }} />
          </div>
          
          {/* Comments Section */}
          <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              Comments
            </h2>
            <Comment props={{ blogid: data.blog._id }} />
          </div>
        </article>
        
        {/* Sidebar */}
        <aside className="lg:w-80 xl:w-96">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Related Posts */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
              <h3 className="text-lg font-display font-bold text-foreground mb-4">
                Related Posts
              </h3>
              <RelatedBlog props={{ category: category, currentBlog: blog }} />
            </div>
            
            {/* Author Card */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
              <h3 className="text-lg font-display font-bold text-foreground mb-4">
                About the Author
              </h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="w-16 h-16 ring-2 ring-primary/20 flex-shrink-0">
                  <AvatarImage src={data.blog.author?.avatar || usericon} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {data.blog.author?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground break-words">{data.blog.author?.name}</p>
                  <p className="text-sm text-muted-foreground mt-1 break-words">
                    {data.blog.author?.bio || 'Passionate writer sharing insights and stories.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SingleBlogDetails;
