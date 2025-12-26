
const express=require('express');
const router=express.Router();
const pool=require('../config/db');
const verifytoken=require('../middleware/authMiddleware');

router.get('/live',verifytoken,async (req,res) => {
          try{
             const userIdFromToken=req.user.id;

    const query = `
      SELECT
        v.license_plate AS "vehicle",
        ps.slot_number AS "slot",
        l.name AS "location",
        b.booking_status AS "status",
        b.start_time,
        b.end_time
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.vehicle_id
      JOIN parking_slots ps ON b.slot_id = ps.slot_id
      JOIN sublocations sl ON ps.sublocation_id = sl.sublocation_id
      JOIN locations l ON sl.location_id = l.location_id
      WHERE
        b.user_id = $1 AND
        b.booking_status IN ('confirmed', 'parked')
      ORDER BY b.start_time DESC
      LIMIT 1;
    `;

     const {rows} =await pool.query(query,[userIdFromToken]);

       if(rows.length == 0){
          return res.status(404).json({message :'no active booking found'});

       }
    const liveBooking = rows[0];
    
       const formatTime=(date)=> new Date(date).toLocaleTimeString('en-US',{
         hour:'2-digit',
         minute:'2-digit',
         hour12:true 

    });

       const formattedResponse = {
        vehicle: liveBooking.vehicle,
        slot: liveBooking.slot,
        location: liveBooking.location,
        status: liveBooking.status.charAt(0).toUpperCase() + liveBooking.status.slice(1),
        time: `${formatTime(liveBooking.start_time)} - ${formatTime(liveBooking.end_time)}`
    };



   res.status(200).json(formattedResponse);


          }catch(error){
              console.error('Server error on getting live status:', error.message);
            res.status(500).json({ message: 'Server Error' });
          }
});

module.exports=router;
