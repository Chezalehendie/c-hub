const express = require('express')
const app = express()

const bodyParser = require('body-parser')
//request body parsing middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const dbConnection = require('./src/utils/mysql.connector')

const {post} = require('./src/posts/post.model')

// update existing post
app.patch('/api/v1/posts:id', function( request, response){
    //console.log (request.params)
    //get id fromm request, use id to select a post from db, update post and request
    const sql = `SELECT * FROM posts WHERE id=${request.params.id} LIMIT 1`

    return dbConnection.query(sql, function (err, rows){
        if (err) throw err
        const post = request.body//console.log(Object.entries(post))

        if (rows.length >=1){
            let props = ''

            props = Object.keys(post).map((key, index)=> {
                //console.log(key)
                //console.log(Object.values(post).at(index))
                return props += `${[key]}='${Object.values(post).at(index)}',`
            })
            //console.log(props[props.length - 1].slice(0, -1))

            const updateSql = `UPDATE posts SET ${props[props.length - 1].slice(0, -1)} WHERE id=${rows[0].id}`

            //console.log(updateSql)
            return dbConnection.query(updateSql, function (err, result){
                return response.json(rows[0])
            })}
            else{
                return response.status(404).json({
                    status: false,
                    statusCode: 404,
                    message: `post with id ${request.params.id} does not exist.`
                })
            }
        })

    })
//delete existing post
app.delete('/api/v1/posts/:id',(req,res)=>{
    //grab id from req object, check if posts with id exists, if yes, delete and return response to client

})
//fetching a single post from the db, sending to client app 


app.get('/api/v1/posts/:id',function(req,res){
    //console.log (req.params)
    //grab id from req.params.id, query db if this post(id) exist, return to the client app(web client)
    const sqlQuery = `SELECT * FROM posts WHERE id = ${req.params.id} LIMIT 1`
    //console.log(sqlQuery)
    dbConnection.query(sqlQuery,(err,row)=>{
        if(err) throw err
        return res.status(200).json({
            status:true,
            statusCode:200,
            data:row
        })
    })
})
app.get('/api/v1/posts',function(req, res){
    var sql2 = "SELECT * FROM posts"

    return dbConnection.query(sql2, function (err, result){
        if (err) throw err;

        return res.status(200).json({
            status:true,
            statusCode:200,
            data:result
        })

    })
})

//create new post/article in the database
app.post('/api/v1/posts', function(req, res) {
    //console.log(req.body)
    const { name, id, summary } = req.body //destructure sent properties from theREQUEST body

    //construct sql query
    var sql = `INSERT INTO posts (name, id, summary) VALUE ("${name}" , "${id}" , "${summary}" )`;
    //console.log(sql)
    //query the MYSQL database and return result to the client app ie POSTMAN or WEB APP
    return dbConnection.query(sql, function(err, result){
        if (err) throw err; //if error throw it, else continue execution to next line
        
        return res.status(200).json({
            status:true,
            statusCode:200,
            data:result
        })
        //console.log("1 record inserted");
    });
    //res.json(sql)
    })

app.listen(3000, function(){
    console.log('C-HUB listening on port 3000')

    dbConnection.connect(function (err){
        if (err) throw err

        console.log("connected to MYSQL")
    })
})