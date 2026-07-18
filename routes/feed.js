const express = require('express')
const {body} =  require('express-validator')
const router = express.Router()

const controller = require('../controllers/feed')


router.get('/postsList',controller.getPostsList)
router.post('/post',[
    body('title','Title at least must have 5 charecter')
    .trim()
    .isLength({min:5}),
    body('content','Content at least must have 5 charecter')
    .trim()
    .isLength({min:5})
],controller.creatPost)
router.get('/post/:postId',controller.getPost)
router.put('/post/:postId',controller.updatePost)
router.delete('/post/:postId',controller.deletePost)

module.exports = router ;