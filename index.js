const express = require('express')
const app = express()

const bodyParser = require('body-parser')
//request body parsing middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const dbConnection = require('./src/utils/mysql.connector')

const {post} = require('./src/posts/post.model')
const posts = require('./src/posts/post.router')

// update existing post

//delete existing post

//fetching a single post from the db, sending to client app 
app.use('/', posts)

//create new post/article in the database


app.listen(3000, function(){
    console.log('C-HUB listening on port 3000')

    dbConnection.connect(function (err){
        if (err) throw err

        console.log("connected to MYSQL")
    })
})