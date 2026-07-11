const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const router = require('./routes/feed')


app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,PUT,DELETE,GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    next();
})


app.use('/feed', router)

app.listen(8080)