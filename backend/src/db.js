const { Client } = require('pg')
require('dotenv').config();
const client = new Client({
    host: "localhost",
  port: 5432,
  user: 'postgres',
  password: 'Aditya@123',
  database:'postgres'
});

module.exports = client ;

