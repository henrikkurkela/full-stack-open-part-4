const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.json(blog.toJSON())
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    if (typeof blog.likes === 'undefined' || blog.likes === null) {
        blog.likes = 0
    }

    if (typeof blog.title === 'undefined' || blog.title === null || typeof blog.url === 'undefined' || blog.url === null) {
        response.status(400).end()
    } else {
        const result = await blog.save()
        response.status(201).json(result.toJSON())
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (error) {
        response.status(400).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = {
        likes: request.body.likes
    }
    try {
        const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(result.toJSON())
    } catch (error) {
        response.status(400).end()
    }
})

module.exports = blogsRouter