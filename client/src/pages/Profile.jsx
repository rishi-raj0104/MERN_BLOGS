import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { FiCamera, FiUser, FiMail, FiLock, FiEdit3, FiSave } from "react-icons/fi";
import Dropzone from "react-dropzone";
import { setUser } from "@/redux/user/user.slice";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/helpers/api";

const Profile = () => {
  const [filePreview, setPreview] = useState();
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    data: userData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/user/get-user/${user.user._id}`,
    { method: "get", credentials: "include" }
  );

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    bio: z.string().optional(),
    password: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userData && userData.success) {
      form.reset({
        name: userData.user.name,
        email: userData.user.email,
        bio: userData.user.bio || "",
        password: "",
      });
    }
  }, [userData]);

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const response = await apiFetch(
        `${getEnv("VITE_API_BASE_URL")}/user/update-user/${userData.user._id}`,
        {
          method: "put",
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      dispatch(setUser(data.user));
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileSelection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setPreview(preview);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-border/50 shadow-soft overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-primary relative">
          <div className="absolute inset-0 bg-grid opacity-20"></div>
        </div>
        
        <CardHeader className="relative pb-0">
          {/* Avatar Section */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <Dropzone
              onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
              accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="cursor-pointer group">
                  <input {...getInputProps()} />
                  <div className="relative">
                    <Avatar className="w-32 h-32 ring-4 ring-background shadow-medium">
                      <AvatarImage
                        src={filePreview || userData?.user?.avatar}
                        alt={userData?.user?.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-3xl font-display">
                        {userData?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FiCamera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </Dropzone>
          </div>
          
          {/* Profile Info */}
          <div className="pt-20 text-center">
            <CardTitle className="text-2xl font-display">
              {userData?.user?.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {userData?.user?.email}
            </CardDescription>
            {userData?.user?.role === 'admin' && (
              <Badge className="mt-2 bg-gradient-primary text-white border-0">
                Admin
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                      <FiUser className="w-4 h-4 text-muted-foreground" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your name" 
                        className="h-11 bg-muted/50 border-border focus:bg-background transition-colors"
                        {...field} 
                      />
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
                    <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                      <FiMail className="w-4 h-4 text-muted-foreground" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        className="h-11 bg-muted/50 border-border focus:bg-background transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                      <FiEdit3 className="w-4 h-4 text-muted-foreground" />
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px] bg-muted/50 border-border focus:bg-background transition-colors resize-none"
                        {...field}
                      />
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
                    <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                      <FiLock className="w-4 h-4 text-muted-foreground" />
                      New Password
                      <span className="text-xs text-muted-foreground font-normal">(leave blank to keep current)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        className="h-11 bg-muted/50 border-border focus:bg-background transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-medium transition-all duration-300 shadow-soft hover:shadow-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSave className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
