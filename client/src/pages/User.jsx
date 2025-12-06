import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { FiTrash2, FiUsers } from "react-icons/fi"
import { deleteData } from '@/helpers/handleDelete'
import { showToast } from '@/helpers/showToast'
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const User = () => {
    const [refreshData, setRefreshData] = useState(false)
    
    const { data, loading, error } = useFetch(
        `${getEnv('VITE_API_BASE_URL')}/user/get-all-user`, 
        {
            method: 'get',
            credentials: 'include'
        }, 
        [refreshData]
    )

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return
        
        const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/user/delete/${id}`)
        if (response) {
            setRefreshData(!refreshData)
            showToast('success', 'User deleted successfully')
        } else {
            showToast('error', 'Failed to delete user')
        }
    }

    if (loading) return <Loading />

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="border-border/50 shadow-soft">
                <CardHeader>
                    <CardTitle className="text-2xl font-display flex items-center gap-2">
                        <FiUsers className="w-6 h-6 text-primary" />
                        User Management
                    </CardTitle>
                    <CardDescription>
                        View and manage all registered users
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <div className="rounded-lg border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">User</TableHead>
                                    <TableHead className="font-semibold">Email</TableHead>
                                    <TableHead className="font-semibold">Role</TableHead>
                                    <TableHead className="font-semibold">Joined</TableHead>
                                    <TableHead className="font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data && data.user?.length > 0 ? (
                                    data.user.map(user => (
                                        <TableRow key={user._id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                                                        <AvatarImage src={user.avatar || usericon} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                            {user.name?.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    className={user.role === 'admin' 
                                                        ? 'bg-gradient-primary text-white border-0' 
                                                        : 'bg-secondary text-secondary-foreground'
                                                    }
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {moment(user.createdAt).format('MMM DD, YYYY')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => handleDelete(user._id)}
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <FiUsers className="w-10 h-10 text-muted-foreground mb-2" />
                                                <p className="text-muted-foreground">No users found</p>
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

export default User
