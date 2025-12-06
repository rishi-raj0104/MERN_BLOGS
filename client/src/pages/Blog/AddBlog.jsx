import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import slugify from 'slugify'
import { showToast } from '@/helpers/showToast'
import { getEnv } from '@/helpers/getEnv'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useFetch } from '@/hooks/useFetch'
import Dropzone from 'react-dropzone'
import Editor from '@/components/Editor'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RouteBlog } from '@/helpers/RouteName'
import { apiFetch } from '@/helpers/api'
import { FiImage, FiX, FiPlus, FiSend } from 'react-icons/fi'
import { BiPen } from 'react-icons/bi'

const AddBlog = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')
    
    const { data: categoryData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`, {
        method: 'GET',
        credentials: 'include'
    })

    const [filePreview, setPreview] = useState()
    const [file, setFile] = useState()

    const formSchema = z.object({
        category: z.string().min(1, 'Please select a category'),
        title: z.string().min(3, 'Title must be at least 3 characters'),
        slug: z.string().min(3, 'Slug must be at least 3 characters'),
        blogContent: z.string().min(10, 'Blog content must be at least 10 characters'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            title: '',
            slug: '',
            blogContent: '',
        },
    })

    const handleEditorData = (event, editor) => {
        const data = editor.getData()
        form.setValue('blogContent', data)
    }

    const blogTitle = form.watch('title')

    useEffect(() => {
        if (blogTitle) {
            const slug = slugify(blogTitle, { lower: true })
            form.setValue('slug', slug)
        }
    }, [blogTitle])

    const handleAddTag = (e) => {
        e.preventDefault()
        if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
            setTags([...tags, tagInput.trim().toLowerCase()])
            setTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    async function onSubmit(values) {
        setIsSubmitting(true)
        try {
            const newValues = { ...values, author: user.user._id, tags }
            if (!file) {
                showToast('error', 'Featured image is required')
                setIsSubmitting(false)
                return
            }

            const formData = new FormData()
            formData.append('file', file)
            formData.append('data', JSON.stringify(newValues))

            const response = await apiFetch(`${getEnv('VITE_API_BASE_URL')}/blog/add`, {
                method: 'POST',
                body: formData
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }
            form.reset()
            setFile(null)
            setPreview(null)
            setTags([])
            navigate(RouteBlog)
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileSelection = (files) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        setFile(file)
        setPreview(preview)
    }

    return (
        <div className='max-w-3xl mx-auto'>
            <Card className="border-border/50 shadow-soft overflow-hidden">
                <CardHeader className="bg-gradient-hero border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-primary rounded-xl shadow-soft">
                            <BiPen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-display">Create New Post</CardTitle>
                            <CardDescription>Share your thoughts with the world</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Category */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground font-medium">Category</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="h-11 bg-muted/50 border-border">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categoryData && categoryData.category?.length > 0 &&
                                                        categoryData.category.map(category => (
                                                            <SelectItem key={category._id} value={category._id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground font-medium">Title</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Enter an engaging title" 
                                                className="h-11 bg-muted/50 border-border focus:bg-background transition-colors"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            {/* Slug */}
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground font-medium">Slug</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="url-friendly-slug" 
                                                className="h-11 bg-muted/50 border-border focus:bg-background transition-colors"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            {/* Tags */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Tags</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        placeholder="Add a tag"
                                        className="h-11 bg-muted/50 border-border focus:bg-background transition-colors"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={handleAddTag}
                                        className="h-11 px-4"
                                    >
                                        <FiPlus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {tags.map((tag, index) => (
                                            <Badge 
                                                key={index} 
                                                variant="secondary"
                                                className="px-3 py-1 flex items-center gap-1.5"
                                            >
                                                #{tag}
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="hover:text-destructive transition-colors"
                                                >
                                                    <FiX className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Featured Image */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Featured Image</label>
                                <Dropzone 
                                    onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}
                                    accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] }}
                                >
                                    {({ getRootProps, getInputProps, isDragActive }) => (
                                        <div 
                                            {...getRootProps()} 
                                            className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                                                isDragActive 
                                                    ? 'border-primary bg-primary/5' 
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                        >
                                            <input {...getInputProps()} />
                                            {filePreview ? (
                                                <div className="relative aspect-video">
                                                    <img 
                                                        src={filePreview} 
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setFile(null)
                                                            setPreview(null)
                                                        }}
                                                        className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-destructive hover:text-white transition-colors"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-12">
                                                    <div className="p-3 bg-muted rounded-full mb-3">
                                                        <FiImage className="w-6 h-6 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {isDragActive 
                                                            ? 'Drop the image here' 
                                                            : 'Drag & drop or click to upload'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        PNG, JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                            
                            {/* Blog Content */}
                            <FormField
                                control={form.control}
                                name="blogContent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground font-medium">Content</FormLabel>
                                        <FormControl>
                                            <Editor props={{ initialData: '', onChange: handleEditorData }} />
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
                                        <FiSend className="w-4 h-4 mr-2" />
                                        Publish Post
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddBlog
