import React, { useState } from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'
import { RouteSearch } from '@/helpers/RouteName'
import { FiSearch } from 'react-icons/fi'

const SearchBox = () => {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    
    const getInput = (e) => {
        setQuery(e.target.value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(RouteSearch(query))
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
                name="q" 
                value={query}
                onInput={getInput} 
                placeholder="Search articles..." 
                className="h-10 pl-11 pr-4 rounded-full bg-muted/50 border-border focus:bg-background transition-colors" 
            />
        </form>
    )
}

export default SearchBox
