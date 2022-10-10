var jwt = require('jsonwebtoken'); 
const JWT_SECRET = "adityaisagoodboy" ;
const fetchuser = ( req , res , next ) =>{
      const token = req.header('auth-token') ;
      if ( !token ) {
        res.status(500).send({error:'please authenticate with valid token '}) ;
      }
      try {
         const data = jwt.verify(token , JWT_SECRET) ;
         console.log(data) ;
         req.user_name = data ;
         next() ;
      } catch (error) {
        res.status(401).send({error:'please authenticate with valid token '}) ;
      }
}

module.exports = fetchuser ;