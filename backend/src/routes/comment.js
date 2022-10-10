const express = require('express');
const client = require('../db');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();

// -- create table comments(comm_id serial primary key,commenter_user_name text,blog_id INT,description text,support INT , supporter text ARRAY);
router.post('/addcomment/:id' , fetchuser , async(req,res)=>{
try {
    const blog_id = req.params.id ;
const {description} = req.body ;
const comm_user_name = req.user_name ;
let like = 0 ;
       await client.query(`insert into comments (email , description ,blog_id , support ,supporter ) values ('${comm_user_name}' ,'${description}', '${blog_id}' , ${like} , '{}') ;`)
      res.status(200).json({message:"comment added successfully" , value : 0}) ;
} catch (error) {
    console.log(error.message);
    res.status(500).json({message:"comment is not added" , value : -1});
}
})




router.get('/fetchcomment/:id' , fetchuser , async(req,res)=>{
    try {
        const blog_id = req.params.id ;
    const user_id_comm = req.email ;
          const data = await client.query(`select *from comments where blog_id=${blog_id} ;`)
          const show = data.rows[0];
          res.status(200).json(show) ;
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:" not ok"});
    }
    })



router.put('/likeComment/:id'  ,fetchuser, async(req,res)=>{
    try {
        const user_name = req.user_name ;
    const comment_id = req.params.id ;
    const data = await client.query(`select * from comments where comm_id=${comment_id};` );
    const newsupport = data.rows[0].support + 1 ;
    console.log(newsupport);
    await client.query(`update comments set support=${newsupport} ,supporter=supporter || '{${user_name}}' where comm_id=${comment_id};`);
    res.status(200).json({message:"comment is liked" , value :0});
} catch (error) {
        console.log(error.message);
        res.status(500).json({message:"comment will not be liked" , value :-1})
}
})
module.exports = router ;