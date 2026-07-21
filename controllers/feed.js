const { validationResult } = require('express-validator')
const Post = require('../models/post');
const User = require('../models/user')
const path = require('path');
const fs = require('fs');
const { json } = require('body-parser');
const post = require('../models/post');

exports.getPostsList = async (req, res, next) => {
    try {
        const postsList = await Post.find();
        res.status(200).json({ message: 'Post Lists are fetched', posts: postsList })

    } catch (error) {
        if (!error.statusCode) {
            error.status = 404
        }
        next(error)
    }
}

exports.creatPost = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());

            let error = new Error(errors.array()[0].msg)
            error.statusCode = 422
            throw error;

        }
        if (!req.file) {
            const error = new Error('Image not found!')
            error.statusCode = 404;
            throw error;
        }

        const title = req.body.title;
        const content = req.body.content;


        const post = new Post({
            title: title,
            content: content,
            imageUrl: req.file.filename,
            creator: req.userId,

        })
        const postResult = await post.save()

        const user = await User.findById(req.userId);

        user.posts.push(postResult) // why we don't use await?

        const creator = await user.save()


        res.status(201).json({
            message: 'creat  post',
            posts: postResult ,
            creator:creator
        })
    } catch (err) {
        if (!err.statusCode) {
            err.status = 500
        }
        next(err)
    }

}

exports.getPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Cannot find post!")
            error.statusCode = 404;
            throw error
        }

        res.status(200).json({ message: 'Post find in DB', post: post })

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error)
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            let error = new Error(errors.array()[0].msg)
            error.statusCode = 422
            throw error;
        }

        const postId = req.params.postId;
        const content = req.body.content;
        const title = req.body.title;
        let imageUrl = req.body.image 

        if (req.file) {
            imageUrl = req.file.filename 
        }
        if (!imageUrl) {
            const error = new Error('Please upload a file first')
            error.statusCode = 422
            throw error
        }

        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error('Post not found ')
            error.statusCode = 404
            throw error
        }

        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl)
        }

        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        await post.save();

        res.status(200).json({
            message: 'post updated successfuly',
            post: post
        })

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error)
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error('Post not finde !')
            error.statusCode=404
            throw error
        }

        clearImage(post.imageUrl)
        await post.deleteOne();
        // const deletePost = await Post.findByIdAndDelete(postId);
        res.status(200).json({message:'Post deleted successfuly :)'})

    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        next(error)
    }
}

const clearImage = (filePath) => {
    const filepath = path.join(__dirname, '..', '/images', filePath);
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
        console.log('Image deleted successfully');
    } else {
        console.log('Cant delete image!');
    }
}