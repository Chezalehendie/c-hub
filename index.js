const express = require('express')
const app = express()

const post = require('./src/posts/post.model')

app.get('/',function(req, res){
    return res.json(req)
})


app.listen(3000, function(){
    console.log('C-HUB listening on port 3000')
})