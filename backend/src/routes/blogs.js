const express = require('express') ;
const client = require('../db');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router() ;
const { body, validationResult } = require('express-validator');
const { response } = require('express');

// create table blogs ( id serial primary key , title text , tag text , description text , user_name text , support int ) ;
// insert into blogs (title , tag , description , email) values ( 'hello2' , 'general2' , 'good2 habit2 ' , 'prince@gmail.com' ) ;


// route for fetching all blogs of user route 1 
router.get('/getAllBlogsof_user' , fetchuser , async(req,res)=>{
    try {
        const user_name = req.user_name ;
        console.log(user_name);
        const data = await client.query(`select 
        *from blogs where user_name='${user_name}';`) ;
        const user = await client.query(`select *from users where user_name = '${user_name}' ;`) ;
        const newdata = data.rows ;
        const newuserdata = user.rows[0];
        const object = {
            "user_details":newuserdata,
            "blogs":newdata
        }
        console.log(newdata);
        res.status(200).json(object);
    } catch (error) {
        res.status(500).json({message:"blogs can not fetched" , value: -1}) ;
        console.log(error.message) ;
    }
},)

// route for adding blog route 2
router.post('/addblog' ,fetchuser,[
    body('title' , 'Enter a valid title').isLength({ min: 3 }),
    body('description' , 'enter a valid description').isLength({ min: 5 }),
    body('tag' , 'enter a valid tag').isLength({ min: 3 })
],async(req,res)=>{
    const errors = validationResult(req).errors;
    if (errors.length!=0) {
      return res.status(400).json({ errors: errors.message });
    }
    try {
        let support = 0 ;
        const user_name = req.user_name ;
        const { title , tag , description} = req.body ;
         
        const exist = await client.query(`select *from users where user_name='${user_name}';`)
        // console.log(exist);
        if(exist.rows.length==0){
            return res.status(500).json({message:"please login first then add note " , value : -1})
        }
        const already = await client.query(`select *from blogs where user_name='${user_name}' AND title='${title}' AND tag='${tag}' AND description='${description}';`) 
        if(already.rowCount ==0 ){
            const data = await client.query(`insert into blogs (title , tag , description , user_name , support ) values ( '${title}' ,'${tag}' , '${description}','${user_name}' , '${support}' ) ;`) ;
            res.status(200).json({message:"blog added successfully" , value :0});
        }else {
            res.status(500).json({message:"blog already exist" , value :2})
        }
        

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"cant add blog" , value : -1});
    }
},)



// route for editing blog route 3 

router.put('/editBlog/:id' ,fetchuser,  async(req,res)=>{
         try {
            const {title , tag , description } = req.body ;
            const blog_id = req.params.id ;
            const blog = await client.query( `select *from blogs where id=${blog_id} ;`);
        if ( blog.rows[0].user_name === req.user_name ){
            const data = await client.query(`update blogs set title='${title}' , tag='${tag}' , description='${description}' where id=${blog_id}`)
            res.json({message:"blog updated ok" , value : 0});
        }else {
            res.json({message:"you can not update blog " , value : -2});
        }
         } catch (error) {
            console.log(error.message);
            res.status(500).json({message: "blog can not updated blog" , value: -1});
         }
      
})



// route for deleting blog routr 4

router.delete('/deleteblog/:id' , fetchuser , async(req,res)=>{
    try {
        const blog_id = req.params.id ;
        const blog = await client.query( `select *from blogs where id=${blog_id} ;`);
    if ( blog.rows[0].user_name === req.user_name ){
        const data = await client.query(`delete from blogs where id=${blog_id}`)
        res.json({message:"deleted blog" , value : 0});
    }else {
        res.json({message:"you cannot delete blog " , value : -2});
    }
     } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"cant delete blog" , value : -1});
     }
  
})


// route for fetching all blogs 

router.get('/fetchallblogs' , async (req,res)=>{
    try {
        const data = await client.query(`select *from blogs ;`) ;
        res.status(200).json(data.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"can not fetch all blogs " , value : -1});
    }
})


//route for fetching notes by category 

router.get('/blogs/:category' , async (req,res)=>{
    try {
        const category = req.params.category ;
        const data = await client.query(`select *from blogs where tag='${category}'`)
        console.log(data.rows);
        res.status(200).json(data.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json("can not fetch  blogs ");
    }
})



module.exports = router ;