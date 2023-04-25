import * as express from 'express'
import * as bodyParser from 'body-parser'
import {AppDataSource} from './src/utils/mysql.connector'
import posts from './src/posts/post.router'

const app = express()

//const bodyParser = require('body-parser')
//request body parsing middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//const dbConnection = require('./src/utils/mysql.connector')

//const {post} = require('./src/posts/post.model')
//const posts = require('./src/posts/post.router')

app.use('/', posts)

app.listen(3000, function(){
    console.log('C-HUB listening on port 3000')

    AppDataSource.initialize()
    .then(conn => { 
      console.log("connected to mysql")
    }).catch(err => {
        if (err) throw err
    })
})