const express = require('express')
const {body} =  require('express-validator')
const router = express.Router()

const controller = require('../controllers/feed')


router.get('/post',controller.getPost)
router.post('/post',[
    body('title','Title at least must have 6 charecter')
    .trim()
    .isLength({min:5}),
    body('content','Content at least must have 6 charecter')
    .trim()
    .isLength({min:5})
],controller.creatPost)

module.exports = router ;