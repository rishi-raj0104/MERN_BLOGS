import React from 'react'
import { BiPen } from "react-icons/bi";

const Loading = () => {
    return (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm'>
            {/* Animated Logo */}
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse"></div>
                <div className="relative p-4 bg-gradient-primary rounded-2xl shadow-glow animate-float">
                    <BiPen className="w-10 h-10 text-white" />
                </div>
            </div>
            
            {/* Loading Text */}
            <div className="mt-6 text-center">
                <p className="text-lg font-display font-semibold text-foreground mb-2">
                    BlogVerse
                </p>
                
                {/* Animated Dots */}
                <div className="flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
            </div>
        </div>
    )
}

export default Loading
