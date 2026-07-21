const express = require('express')
const { body } = require('express-validator')
const router = express.Router()

const isAuth = require('../middlewares/auth-verify')
const controller = require('../controllers/feed')


router.get('/postsList', isAuth, controller.getPostsList)
router.post('/post', [
    body('title', 'Title at least must have 5 charecter')
        .trim()
        .isLength({ min: 5 }),
    body('content', 'Content at least must have 5 charecter')
        .trim()
        .isLength({ min: 5 })
], isAuth, controller.creatPost)
router.get('/post/:postId', isAuth, controller.getPost)
router.put('/post/:postId', isAuth, controller.updatePost)
router.delete('/post/:postId', isAuth, controller.deletePost)

module.exports = router;