import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { RouteIndex } from "@/helpers/RouteName";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const {
    data: blogData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/search?q=${q}`,
    {
      method: "get",
      credentials: "include",
    },
    [q]
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

        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <FiSearch className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Search Results
            </h1>
            <p className="text-muted-foreground mt-1">
              {blogData?.blog?.length || 0} results for "{q}"
            </p>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {blogData && blogData.blog?.length > 0 ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
          {blogData.blog.map((blog, index) => (
            <BlogCard key={blog._id} props={blog} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
            <FiSearch className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-2">
            No results found
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any posts matching "{q}". Try different keywords or
            browse all posts.
          </p>
          <Button asChild variant="outline">
            <Link to={RouteIndex}>Browse All Posts</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
