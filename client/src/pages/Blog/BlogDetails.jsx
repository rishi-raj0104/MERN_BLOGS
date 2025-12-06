import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { RouteBlogAdd, RouteBlogEdit } from '@/helpers/RouteName'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import { deleteData } from '@/helpers/handleDelete'
import { showToast } from '@/helpers/showToast'
import Loading from '@/components/Loading'
import { useState } from 'react'
import { FiEdit, FiTrash2, FiPlus, FiFileText, FiEye } from "react-icons/fi"
import moment from 'moment'

const BlogDetails = () => {
    const [refreshData, setRefreshData] = useState(false)
    
    const { data: blogData, loading, error } = useFetch(
        `${getEnv('VITE_API_BASE_URL')}/blog/get-all`, 
        {
            method: 'get',
            credentials: 'include'
        }, 
        [refreshData]
    )

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return
        
        const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/delete/${id}`)
        if (response) {
            setRefreshData(!refreshData)
            showToast('success', 'Blog deleted successfully')
        } else {
            showToast('error', 'Failed to delete blog')
        }
    }

    if (loading) return <Loading />

    return (
        <div className='max-w-5xl mx-auto'>
            <Card className="border-border/50 shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-2xl font-display flex items-center gap-2">
                            <FiFileText className="w-6 h-6 text-primary" />
                            My Blog Posts
                        </CardTitle>
                        <CardDescription>
                            Manage and edit your blog posts
                        </CardDescription>
                    </div>
                    <Button asChild className="bg-gradient-primary hover:opacity-90 text-white">
                        <Link to={RouteBlogAdd}>
                            <FiPlus className="w-4 h-4 mr-2" />
                            New Post
                        </Link>
                    </Button>
                </CardHeader>
                
                <CardContent>
                    <div className="rounded-lg border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">Title</TableHead>
                                    <TableHead className="font-semibold">Category</TableHead>
                                    <TableHead className="font-semibold">Author</TableHead>
                                    <TableHead className="font-semibold">Views</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {blogData && blogData.blog?.length > 0 ? (
                                    blogData.blog.map(blog => (
                                        <TableRow key={blog._id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium max-w-[200px]">
                                                <p className="truncate">{blog?.title}</p>
                                                <p className="text-xs text-muted-foreground truncate">{blog?.slug}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal">
                                                    {blog?.category?.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {blog?.author?.name}
                                            </TableCell>
                                            <TableCell>
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <FiEye className="w-3.5 h-3.5" />
                                                    {blog?.views || 0}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {moment(blog?.createdAt).format('MMM DD, YYYY')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary" 
                                                        asChild
                                                    >
                                                        <Link to={RouteBlogEdit(blog._id)}>
                                                            <FiEdit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => handleDelete(blog._id)}
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <FiFileText className="w-10 h-10 text-muted-foreground mb-2" />
                                                <p className="text-muted-foreground">No blog posts yet</p>
                                                <Button asChild variant="link" className="mt-2">
                                                    <Link to={RouteBlogAdd}>Create your first post</Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default BlogDetails
