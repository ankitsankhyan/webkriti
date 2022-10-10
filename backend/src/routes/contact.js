const express = require('express');
const router = express.Router();
const client = require('../db');
// create table contact (name text , email text , message text ) ;
router.post('/contact' , async (req,res)=>{
    try {
        const {name , email , message } = req.body ;
    const data = await client.query(`insert into contact values ( '${name}' , '${email}' , '${message}') ; `)
    res.status(200).json({message:"ok"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"contac form is not submitted..."}) ;
    }
})

module.exports = router ;