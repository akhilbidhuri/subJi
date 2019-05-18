let mysql = require('mysql');

process.env.DB_PASSWORD = ""
if (
  !process.env.DB_NAME
  || !process.env.DB_USERNAME
  || !process.env.DB_HOST
  || !process.env.DB_PORT
  || !process.env.DB_DIALECT
) {
  console.log('Please set MySQL ENV variables');
  process.exit(-1);
}

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
  console.log('Connected to the MySQL server.');
});
module.exports = connection;