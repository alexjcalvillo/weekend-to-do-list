const pg = require('pg');
const Pool = pg.Pool;
const config = {
  database: 'weekend-to-do-app', // name of database
  host: 'localhost',
  port: 5432,
  max: 10, // max number of concurrent connections
  idleTimeoutMillis: 10000, // attepmt to connect for 10 seconds
};

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('postgresql connected!!!');
});

pool.on('error', (error) => {
  console.log('Error connecting to db', error);
});

module.exports = pool;
