import express from 'express'
import { doLike, likeCount } from '../controllers/BlogLike.controller.js'
import { authenticate } from '../middleware/authenticate.js'

const BlogLikeRoute = express.Router()

BlogLikeRoute.post('/do-like', authenticate, doLike)
// Use optional userid parameter to handle both logged-in and anonymous users
BlogLikeRoute.get('/get-like/:blogid{/:userid}', likeCount)

export default BlogLikeRoute