const express = require('express')
const client = require('./db')
const auth = require('./routes/auth')
const blogs = require('./routes/blogs')
const contact = require('./routes/contact')
const comments = require('./routes/comment')
const cors = require('cors');
const app = express()
client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

const port =5000
app.use(express.json());
app.use(express.static('../frontend'));
// const corsOptions = {
//   origin: ['http://localhost:5000'],
//   methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
// };
app.use(cors({
  origin: 'http://127.0.0.1:5501'
}));
app.get('/', (req, res) => {
  res.status(200).json({user:"aditya kumar jain" , id:1234});
})
app.use('/api/auth' , auth);
app.use('/api/blogs' , blogs) ;
app.use('/api/blogs/comment' , comments) ;
app.use('/api' , contact);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})