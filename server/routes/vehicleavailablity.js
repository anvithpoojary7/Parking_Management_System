const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifytoken = require('../middleware/authMiddleware');


 
router.get('/', verifytoken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userVehicles = await pool.query(
      "SELECT vehicle_id, license_plate, vehicle_type, model, color FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(userVehicles.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/', verifytoken, async (req, res) => {
  
  const { license_plate, vehicle_type, model, color } = req.body;

  
  if (!license_plate || !vehicle_type) {
    return res.status(400).json({ message: 'License plate and vehicle type are required.' });
  }

  try {
    const userId = req.user.id;

  
    const newVehicle = await pool.query(
      "INSERT INTO vehicles (user_id, license_plate, vehicle_type, model, color) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, license_plate, vehicle_type, model, color]
    );

    res.status(201).json(newVehicle.rows[0]);
  } catch (err) {
    console.error(err.message);
    
    if (err.code === '23505') { 
      return res.status(409).json({ message: 'This license plate is already registered to your account.' });
    }
    res.status(500).send('Server Error');
  }
});


router.get('/:vehicleId/status',verifytoken,async (req,res) => {
           try{
                const {vehicleId} =req.params;
                 const userId=req.user.id;

                 const vehicleowner='SELECT user_id FROM vehicles where vehicle_id=$1';
                 const vehicleResult=await pool.query(vehicleowner,[vehicleId]);

                 if(vehicleResult.rows.length === 0){
                    return res.status(404).json({message:'vehicle not found'});

                 }
                 if(vehicleResult.rows[0].user_id !== userId){
                      return res.status(403).json({ message: 'Forbidden: You do not own this vehicle.' });
                 }
                  
                 const activeBookingQuery=`SELECT booking_id FROM bookings
                  WHERE vehicle_id=$1 AND booking_status IN('confirmed','parked')
                  AND END_TIME > NOW()
                   LIMIT 1; `;

                   const {rows}=await pool.query(activeBookingQuery,[vehicleId]);

                   if(rows.length > 0){
                       res.status(200).json({isParked:true,message:'Vehicle already has an active booking.'});

                   }else{
                     res.status(200).json({ isParked: false, message: 'Vehicle is available for booking.' });
                   }

           }catch(error){
                 console.error('Error checking vehicle status:', error.message);
    res.status(500).json({ message: 'Server Error' });
           }
})


module.exports = router;
