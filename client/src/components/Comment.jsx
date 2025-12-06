import React, { useState } from "react";
import { FiSend, FiMessageSquare } from "react-icons/fi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { apiFetch } from "@/helpers/api";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useSelector } from "react-redux";
import { RouteSignIn } from "@/helpers/RouteName";
import CommentList from "./CommentList";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import usericon from '@/assets/images/user.png';

const Comment = ({ props }) => {
  const [newComment, setNewComment] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state) => state.user);
  
  const formSchema = z.object({
    comment: z.string().min(3, "Comment must be at least 3 characters"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const newValues = {
        ...values,
        blogid: props.blogid,
        user: user.user._id,
      };
      const response = await apiFetch(
        `${getEnv("VITE_API_BASE_URL")}/comment/add`,
        {
          method: "POST",
          body: JSON.stringify(newValues),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      setNewComment(data.comment);
      form.reset();
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user && user.isLoggedIn ? (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 ring-2 ring-primary/20 flex-shrink-0">
            <AvatarImage src={user.user.avatar || usericon} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.user.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Textarea 
                          placeholder="Share your thoughts..." 
                          className="min-h-[100px] pr-12 bg-muted/50 border-border focus:bg-background transition-colors resize-none"
                          {...field} 
                        />
                        <Button 
                          type="submit"
                          size="icon"
                          className="absolute bottom-3 right-3 w-9 h-9 bg-gradient-primary hover:opacity-90 rounded-full shadow-soft"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <FiSend className="w-4 h-4 text-white" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-xl p-6 text-center">
          <FiMessageSquare className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">
            Sign in to join the conversation
          </p>
          <Button asChild className="bg-gradient-primary hover:opacity-90 text-white">
            <Link to={RouteSignIn}>Sign In to Comment</Link>
          </Button>
        </div>
      )}

      {/* Comments List */}
      <CommentList props={{ blogid: props.blogid, newComment }} />
    </div>
  );
};

export default Comment;
