const Pool = require('pg').Pool;

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const MAX = 5;
const pool = null;

function createPool(){
    const pool = new Pool({
      CONNECTION_STRING,
      max: MAX
    });
    return pool;
  }
  
  function getPool(){
    if(!pool){
      pool = createPool();
    }
    return pool;
  }
  
  export default { getPool };