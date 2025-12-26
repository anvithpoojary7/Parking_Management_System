const express=require('express');
const router=express.Router();
const pool=require('../config/db');
console.log('✅ parkingavailability.js file was loaded!');
router.post('/', async (req, res) => {
  try {
     console.log('✅ POST /api/searchslots/ route was hit!'); 
    const { location, startTime, endTime, vehicleType } = req.body; 

    
    const locRes = await pool.query(
      "SELECT location_id FROM locations WHERE name = $1",
      [location]
    );
    if (locRes.rows.length === 0) {
      return res.status(404).json({ message: 'No location found' });
    }
    const locationId = locRes.rows[0].location_id;

    
    const subRes = await pool.query(
      "SELECT sublocation_id FROM sublocations WHERE location_id = $1",
      [locationId]
    );
    const sublocationIds = subRes.rows.map((r) => r.sublocation_id);

    
    let query = `
      SELECT ps.slot_id, ps.slot_number, ps.slot_type, ps.rate_per_hour, ps.vehicle_type, s.name AS sublocation_name
      FROM parking_slots ps
      JOIN sublocations s ON ps.sublocation_id = s.sublocation_id
      WHERE ps.is_active = TRUE
      AND ps.sublocation_id = ANY($1)
      AND ps.slot_id NOT IN (
        SELECT b.slot_id
        FROM bookings b
        WHERE (b.start_time < $2 AND b.end_time > $3)
      )
    `;

  
    let values = [sublocationIds, endTime, startTime];

    
    if (vehicleType) {
      query += " AND ps.vehicle_type = $4";
      values.push(vehicleType);
    }

    
    const slotsRes = await pool.query(query, values);

    res.json(slotsRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;