const express = require('express')
const { body } = require('express-validator')
const router = express.Router()

const authController = require('../controllers/auth')

router.post('/signup', [
    body('name', 'name chatachter minimum is 5 charecter')
        .trim()
        .isLength({ min: 5 })
    ,
    body('email', 'the enterd email is not valid')
        .isEmail()
        .trim()
        .notEmpty()
    ,
    body('password', 'password charecter minimum is 4 ')
        .trim()
        .isLength({ min: 4 })

], authController.postSignup)

router.post('/login' , authController.postLogin)

module.exports = router;