import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RouteIndex, RouteSignUp } from "@/helpers/RouteName";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";
import GoogleLogin from "@/components/GoogleLogin";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { BiPen } from "react-icons/bi";
import { apiFetch } from "@/helpers/api";
import { setCSRFToken } from "@/helpers/csrf";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(3, "Password is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const response = await apiFetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      
      // Store CSRF token if provided
      if (data.csrfToken) {
        setCSRFToken(data.csrfToken);
      }
      
      dispatch(setUser(data.user));
      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-dots opacity-50"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-foreground">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
                <BiPen className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-display font-bold">BlogVerse</span>
            </div>
            
            <h1 className="text-5xl font-display font-bold leading-tight mb-6">
              Share Your Story<br />
              <span className="inline-block font-bold px-4 py-1 rounded-lg ml-2 text-5xl"
                style={{
                  background: "linear-gradient(91deg, #a692f6 0%, #f676ae 100%)",
                  color: "#fff",
                  fontFamily: "inherit",
                  boxShadow: "0 1px 6px 0 rgba(116,69,226,0.12)",
                  lineHeight: 1.2,
                  letterSpacing: "normal",
                  minWidth: 56,
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                aria-label="With The World"
              >With The World</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md mb-8">
              Join thousands of writers and readers. Create beautiful blog posts, 
              connect with your audience, and grow your online presence.
            </p>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Writers</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Blog Posts</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100K+</div>
                <div className="text-sm text-muted-foreground">Readers</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Shapes */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent"></div>
      </div>
      
      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-2.5 bg-gradient-primary rounded-xl">
              <BiPen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold">BlogVerse</span>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to continue to your account</p>
          </div>
          
          {/* Google Login */}
          <GoogleLogin />
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">or continue with email</span>
            </div>
          </div>
          
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          placeholder="name@example.com"
                          className="pl-12 h-12 bg-muted/50 border-border focus:bg-background transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-12 pr-12 h-12 bg-muted/50 border-border focus:bg-background transition-colors"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-medium text-base transition-all duration-300 shadow-soft hover:shadow-medium group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>
          
          {/* Sign Up Link */}
          <p className="text-center mt-8 text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to={RouteSignUp}
              className="text-primary font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
