const express=require('express') ;
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const client = require('../db');
const router = express.Router() ;
const JWT_SECRET = "adityaisagoodboy" ;

// create table users(user_name text , email text , password text , phone_number text ) ;
// SELECT * FROM users where email='amit@gmail.com' ;
// insert into users (name , email , password) values ('aditya rai' , 'aditya@gmail.com' , 'aditya1');


// endpoint for sign up using post request  ROUTE 1
router.post('/signup' ,[
    body('user_name' , 'user name must be atleast 3 character').isLength({ min: 3 }),
    body('email' , 'Enter A valid email').isEmail(),
    body('password' , 'Enter a valid password').isLength({ min: 5 })
], async (req,res)=>{
    const errors = validationResult(req).errors;
    if (errors.length!=0) {
      return res.status(400).json({ errors: errors , value:-2 });
    }
   try {
    const {user_name , email , password , phone_number } = req.body ;
  
      const salt = await bcrypt.genSalt(10) ;
      const secPass = await bcrypt.hash(password,salt )  ;
      const exist2 = await client.query(`select *from users where user_name = '${user_name}' ;`) ;
      if(exist2.rows.length!=0){
        return res.status(500).json({value:-3})
    }
      const exist1 = await client.query(`SELECT * FROM users where email='${email}' ;`)
      if(exist1.rows.length!=0){
        return res.status(500).json({value:-4})
    }
    await client.query(`insert into users values ('${user_name}' , '${email}' , '${secPass}' , '${phone_number}');`)
    const data1 = user_name ;
      const authtoken = jwt.sign(data1 , JWT_SECRET) ;
      res.json({authtoken:authtoken , value : 0}) ;
   } catch (error) {
    console.log(error.message);
    res.status(500).json({ message:"server error occured" , value :-1});
   }
    },
)

// Endpoint for login get request ROUTE 2 
router.get('/login' ,[
    body('user_name' , 'Enter A user_name').isLength({ min: 3 }),
    body('password' , 'Enter a valid password').isLength({ min: 5 })
], async (req,res)=>{
    const errors = validationResult(req).errors;
    if (errors.length!=0) {
      return res.status(400).json({ value:-1, errors: errors });
    }
   try {
    const { user_name , password} = req.body ;
    
    const data = await client.query(`SELECT * FROM users where user_name='${user_name}' AND password = '${password}';`) ;
   const data1 = user_name ;
   const authtoken = jwt.sign(data1 , JWT_SECRET) ;
   console.log("you logged in ...")
   res.json({authtoken:authtoken , value : 0 }) ;
   } catch (error) {
    console.log(error.message);
    res.status(500).json({value:-1});
   }
    },
    )

router.get('/access_user_data' , fetchuser , async(req,res)=>{
  try {
    const user_name = req.user_name ;
    console.log(user_name)
  const data = await client.query(`select *from users where user_name = '${user_name}' ;`);
  // console.log(data) ;
  const newdata = data.rows[0]
   res.status(200).json(newdata);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({value:-1});
  }
  
})


module.exports = router;