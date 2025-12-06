import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import slugify from "slugify";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { apiFetch } from "@/helpers/api";
import { BiCategory } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";

const AddCategory = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const categoryName = form.watch("name");

  useEffect(() => {
    if (categoryName) {
      const slug = slugify(categoryName, { lower: true });
      form.setValue("slug", slug);
    }
  }, [categoryName]);

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const response = await apiFetch(
        `${getEnv("VITE_API_BASE_URL")}/category/add`,
        {
          method: "POST",
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      form.reset();
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card className="border-border/50 shadow-soft overflow-hidden">
        <CardHeader className="bg-gradient-hero border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-primary rounded-xl shadow-soft">
              <BiCategory className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-display">Add Category</CardTitle>
              <CardDescription>Create a new blog category</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Category Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter category name" 
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Slug</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="category-slug" 
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Category
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

export default AddCategory;
