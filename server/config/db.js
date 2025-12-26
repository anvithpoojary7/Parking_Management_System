const {Pool} = require('pg');

const pool=new Pool({
    host:'db',
    port:'5432',
    user:'postgres',
    password:'postgres',
    database:'mydb'
});

pool.connect()
   .then(()=>{
     console.log("connected to postgresql");
   })
   .catch((err)=>{
    console.log("connection error",err.stack);
   })

module.exports=pool;