const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const app = express()

const feedRouter = require('./routes/feed')
const authRouter = require('./routes/auth')
const { body } = require('express-validator')

const imagesPath = path.join(__dirname,'/images')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagesPath)
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null,file.fieldname+'-'+ Date.now() + ext)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp') {
        cb(null, true)
    } else {
        cb(new Error('File type not supported!'), false)
    }
}

const upload = multer({
    storage:storage,
    fileFilter:fileFilter
})

app.use(bodyParser.json())
app.use("/images", express.static(path.join(__dirname, '/images')))
app.use(upload.single('image'))

//Setheader middlewear
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,PUT,DELETE,GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use('/feed',feedRouter )
app.use('/auth', authRouter)

//Errorhandeling middlewear
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message })

})

//Connect mongodb
mongoose.connect('mongodb://localhost:27017/miniblog').then(Result => {
    const server = app.listen(8080, () => {
        console.log(`Server is listening on port 8080`);
    })
    const io = require('./socket').init(server);
    io.on('connection' , () => {
        console.log('Someone connected');
    })
}).catch(err => {
    console.log(err);

})
