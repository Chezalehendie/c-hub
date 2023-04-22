const express = require('express')
const router = express.Router()

const dbConnection = require('../utils/mysql.connector')

router.post('/api/v1/posts', function(req, res) {
    
    const { name, id, summary } = req.body //destructure sent properties from theREQUEST body

    //construct sql query
    var sql = `INSERT INTO posts (name, id, summary) VALUE ("${name}" , "${id}" , "${summary}" )`;
    
    //query the MYSQL database and return result to the client app ie POSTMAN or WEB APP
    return dbConnection.query(sql, function(err, result){
        if (err) throw err; //if error throw it, else continue execution to next line
        
        return res.status(200).json({
            status:true,
            statusCode:200,
            data:result
        })
        
    });
    })

router.get('/api/v1/posts',function(req, res){
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

router.get('/api/v1/posts/:id',function(req,res){
    //grab id from req.params.id, query db if this post(id) exist, return to the client app(web client)
    const sqlQuery = `SELECT * FROM posts WHERE id = ${req.params.id} LIMIT 1`
    
    dbConnection.query(sqlQuery,(err,row)=>{
        if(err) throw err
        return res.status(200).json({
            status:true,
            statusCode:200,
            data:row
        })
    })
})

router.patch('/api/v1/posts/:id', function(request, response){

    //get id from request, use id to select a post from db, update post and request
    const sql = `SELECT * FROM posts WHERE id=${request.params.id} LIMIT 1`

    return dbConnection.query(sql, function (err, rows){
        if (err) throw err
        const post = request.body

        if (rows.length >=1){
            let props = ''

            props = Object.keys(post).map((key, index)=> {
                
                return props += `${[key]}='${Object.values(post).at(index)}',`
            })

            const updateSql = `UPDATE posts SET ${props[props.length - 1].slice(0, -1)} WHERE id=${rows[0].id}`

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

router.delete('/api/v1/posts/:id',(req,res)=>{
    //grab id from request object, check if posts with id exists, if yes, delete and return response to client
    const deleteQuery = `SELECT * FROM posts WHERE id = ${req.params.id} LIMIT 1`

    dbConnection.query(deleteQuery,(err, result)=>{
        if(err) throw err
        
    return res.status(200).json({
        status:true,
        statusCode:200,
        message: "user deleted successfully",
        data:result
    })
  })
})
module.exports = router