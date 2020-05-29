const mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root', //Not a big secret right here, don't worry
  database : 'tcc'
});

module.exports = connection;