const express=require('express');
const router=express.Router();
const pool=require('../config/db');

router.post('/',async(req,res)=>{
     const {sublocation_id,start_time,end_time,maxrate,slot_time} =req.query;
     try{ 
       const result=await pool.query(`
        SELECT  s.slot_id, s.slot_number, s.slot_type, s.rate_per_hour,
             s.description, s.is_active
      FROM parking_slots s
      WHERE s.sublocation_id = $1
        AND s.is_active = TRUE
        AND s.rate_per_hour <= $2
        AND s.slot_type ILIKE $3
        AND NOT EXISTS (
          SELECT 1 FROM bookings b
          WHERE b.slot_id = s.slot_id
            AND b.start_time < $4
            AND b.end_time > $5)

        `,[
        sublocation_id,
      max_rate || 9999,                  // filter max hourly rate
      `%${slot_type || ''}%`,           // partial match for slot type
      end_time,
      start_time
        ]);
    res.json(result.rows);
    
     }
     catch(err){
         console.error("Error fetching slots:", err);
    res.status(500).json({ error: 'Internal server error' });
     }
})

module.exports=router;