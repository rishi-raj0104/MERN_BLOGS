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
import { RouteSignIn } from "@/helpers/RouteName";
import { Link, useNavigate } from "react-router-dom";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import GoogleLogin from "@/components/GoogleLogin";
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { BiPen } from "react-icons/bi";
import { apiFetch } from "@/helpers/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      email: z.string().email("Please enter a valid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z.string().min(8, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const passwordStrength = {
    hasLength: password?.length >= 8,
    hasUpper: /[A-Z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
  };

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const response = await apiFetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/register`,
        {
          method: "POST",
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      navigate(RouteSignIn);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Form */}
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
            <h2 className="text-3xl font-display font-bold mb-2">Create your account</h2>
            <p className="text-muted-foreground">Start your blogging journey today</p>
          </div>
          
          {/* Google Login */}
          <GoogleLogin />
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">or sign up with email</span>
            </div>
          </div>
          
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          placeholder="John Doe"
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
                          placeholder="Create a strong password"
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
                    {/* Password Strength Indicators */}
                    {password && (
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className={`flex items-center gap-1 ${passwordStrength.hasLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                          <FiCheck className={`w-3 h-3 ${passwordStrength.hasLength ? 'opacity-100' : 'opacity-40'}`} />
                          8+ chars
                        </span>
                        <span className={`flex items-center gap-1 ${passwordStrength.hasUpper ? 'text-green-600' : 'text-muted-foreground'}`}>
                          <FiCheck className={`w-3 h-3 ${passwordStrength.hasUpper ? 'opacity-100' : 'opacity-40'}`} />
                          Uppercase
                        </span>
                        <span className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                          <FiCheck className={`w-3 h-3 ${passwordStrength.hasNumber ? 'opacity-100' : 'opacity-40'}`} />
                          Number
                        </span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-12 pr-12 h-12 bg-muted/50 border-border focus:bg-background transition-colors"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-medium text-base transition-all duration-300 shadow-soft hover:shadow-medium group mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>
          
          {/* Sign In Link */}
          <p className="text-center mt-8 text-muted-foreground">
            Already have an account?{" "}
            <Link
              to={RouteSignIn}
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid opacity-30"></div>
        <div className="absolute top-32 right-32 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 left-32 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        
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
              Start Writing<br />
              <span
                className="inline-block font-bold px-4 py-1 rounded-lg ml-2 text-5xl"
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
                aria-label="Your Journey"
              >
                Your Journey
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md mb-8">
              Create a free account and join our community of passionate writers 
              and curious readers from around the world.
            </p>
            
            {/* Features List */}
            <div className="space-y-4">
              {[
                "Create unlimited blog posts",
                "Engage with your audience",
                "Build your personal brand",
                "Analytics and insights"
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative Shapes */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default SignUp;
