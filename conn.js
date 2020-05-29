const util = require( 'util' );
const mysql = require( 'mysql' );

const config = {
  host     : 'localhost',
  user     : 'root',
  password : 'root', //Not a big secret right here, don't worry
  database : 'tcc'
};

function makeDb() {
  const connection = mysql.createConnection( config );
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}

const conn = makeDb();

module.exports = conn;