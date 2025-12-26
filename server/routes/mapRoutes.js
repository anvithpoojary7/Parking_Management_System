const express=require('express');
const router=express.Router();
const pool=require('../config/db');

router.get('/sublocation-coordinates',async(req,res) => {
     const { sublocation} = req.query;
       
     try{
        const result= await pool.query(
            'SELECT latitude,longitude FROM sublocations where name =$1',[sublocation]
        );

        if(result.rows.length === 0){
            return res.status(404).json({ error :'sublocation not found'});

        }
        res.json(result.rows[0]);
     }
     catch(err){
          console.error('Error fetching coordinates:', error);
    res.status(500).json({ error: 'Server error' });
     }


})

module.exports=router;