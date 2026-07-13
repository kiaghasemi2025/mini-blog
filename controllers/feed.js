const { validationResult } = require('express-validator')
const Post = require('../models/post')

exports.getPost = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: '1',
            title: 'post',
            content: 'nature',
            imageUrl: 'images/2431086',
            creator: {
                name: 'kia'
            },
            createdAt: new Date()
        }]
    })
}

exports.creatPost = async (req, res, next) => {

    try {
       
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());

        let error = new Error(errors.array()[0].msg)
        error.statusCode= 422
        throw error;
        
    }

    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/2431086.jpg',
        creator: { name: 'kia' },

    })
    const postResult = await post.save()
    res.status(201).json({
        message: 'creat first post command in restapi',
        posts: postResult
    })
}catch (err) {
    if (!err.statusCode) {
        res.status = 500
    }
    next(err)
}

}