import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiArrowRight,
  FiBookOpen,
  FiUsers,
  FiFeather,
} from "react-icons/fi";
import { BiPen } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { RouteBlogAdd, RouteSignUp } from "@/helpers/RouteName";
import { useSelector } from "react-redux";

const Index = () => {
  const user = useSelector((state) => state.user);

  const { data: blogData, loading } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/blogs`,
    {
      method: "get",
      credentials: "include",
    }
  );

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="absolute inset-0 bg-dots opacity-40"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
              <FiTrendingUp className="w-4 h-4" />
              Discover amazing stories
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight flex items-center justify-center gap-3">
              <span className="whitespace-nowrap">Where Ideas Come to</span>
              {/* "Life" pill-style gradient, now exactly matching the heading's text size */}
              <span
                className="inline-block font-bold px-4 py-1 rounded-lg ml-2 text-4xl md:text-6xl lg:text-7xl"
                style={{
                  background:
                    "linear-gradient(91deg, #a692f6 0%, #f676ae 100%)",
                  color: "#fff",
                  fontFamily: "inherit",
                  boxShadow: "0 1px 6px 0 rgba(116,69,226,0.12)",
                  lineHeight: 1.2,
                  letterSpacing: "normal",
                  minWidth: 56,
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                aria-label="Life"
              >
                Life
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Explore insightful articles, share your perspectives, and connect
              with a community of passionate writers and curious minds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              {user?.isLoggedIn ? (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white h-12 px-8 font-medium shadow-soft hover:shadow-medium transition-all duration-300 group"
                >
                  <Link to={RouteBlogAdd}>
                    <BiPen className="w-5 h-5 mr-2" />
                    Start Writing
                    <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white h-12 px-8 font-medium shadow-soft hover:shadow-medium transition-all duration-300 group"
                >
                  <Link to={RouteSignUp}>
                    Get Started Free
                    <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 font-medium border-2"
              >
                <a href="#latest-posts">
                  <FiBookOpen className="w-5 h-5 mr-2" />
                  Browse Articles
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {[
                {
                  icon: FiFeather,
                  label: "Blog Posts",
                  value: blogData?.blog?.length || "0",
                },
                { icon: FiUsers, label: "Community", value: "Growing" },
                { icon: FiBookOpen, label: "Categories", value: "10+" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-card shadow-soft flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section id="latest-posts" className="py-16 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Latest Posts
              </h2>
              <p className="text-muted-foreground">
                Fresh stories and insights from our community
              </p>
            </div>
            {blogData && blogData.blog?.length > 6 && (
              <Button
                variant="ghost"
                className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80"
              >
                View all
                <FiArrowRight className="w-4 h-4" />
              </Button>
            )}
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
                <FiBookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                No posts yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share your story with the world
              </p>
              {user?.isLoggedIn && (
                <Button
                  asChild
                  className="bg-gradient-primary hover:opacity-90 text-white"
                >
                  <Link to={RouteBlogAdd}>
                    <BiPen className="w-4 h-4 mr-2" />
                    Create First Post
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!user?.isLoggedIn && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 md:p-16 text-center">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-grid"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                  Ready to Start Writing?
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                  Join our community of writers and share your unique
                  perspective with readers worldwide.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 h-12 px-8 font-medium shadow-medium"
                >
                  <Link to={RouteSignUp}>
                    Create Free Account
                    <FiArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
