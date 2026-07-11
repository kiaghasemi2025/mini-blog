const express = require('express')

const router = express.Router()

const controller = require('../controllers/feed')


router.get('/post',controller.getPost)
router.post('/post',controller.creatPost)

module.exports = router ;