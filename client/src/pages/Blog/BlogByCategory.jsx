import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import { FiArrowLeft, FiGrid } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { RouteIndex } from "@/helpers/RouteName";
import { Badge } from "@/components/ui/badge";

const BlogByCategory = () => {
  const { category } = useParams();
  
  const {
    data: blogData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-blog-by-category/${category}`,
    {
      method: "get",
      credentials: "include",
    },
    [category]
  );

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <Button 
          variant="ghost" 
          asChild 
          className="text-muted-foreground hover:text-foreground mb-4 -ml-2"
        >
          <Link to={RouteIndex}>
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <BiCategory className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                {blogData?.categoryData?.name || 'Category'}
              </h1>
              <Badge variant="secondary" className="font-normal">
                {blogData?.blog?.length || 0} posts
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Explore all posts in this category
            </p>
          </div>
        </div>
      </div>
      
      {/* Blog Grid */}
      {blogData && blogData.blog?.length > 0 ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
          {blogData.blog.map((blog, index) => (
            <BlogCard key={blog._id} props={blog} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
            <FiGrid className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-2">
            No posts yet
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            There are no posts in this category yet. Check back later or explore other categories.
          </p>
          <Button asChild variant="outline">
            <Link to={RouteIndex}>
              Browse All Posts
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogByCategory;
