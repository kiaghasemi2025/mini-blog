const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.postSignup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            let error = new Error(errors.array()[0].msg)
            error.statusCode = 422
            throw error;
        }

        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        })

        const result = user.save()

        res.status(201).json({ message: 'User saved successfully', user: result })

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error)
    }
}

exports.postLogin = async (req, res, next) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email });

        if (!user) {
            const error = new Error("There is no user with such email")
            error.statusCode = 401;
            throw error
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            const error = new Error('Pssword is wrong !')
            error.statusCode = 401;
            throw error
        }

        const token = jwt.sign({ email: user.email, userId: user._id.toString() }, 'ShoundShound',
            {
                expiresIn: '1h'
            }
        )
        res.status(200).json({ token: token, userId: user._id.toString() })

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error)
    }
}