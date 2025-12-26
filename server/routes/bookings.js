

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifytoken = require('../middleware/authMiddleware');
const scheduleReminder = require('../jobs/reminderJobs'); 
const { getIo } = require('../socket'); 

router.post("/bookings", verifytoken, async (req, res) => {
 
  const client = await pool.connect();

  try {
    const user_Id = req.user.id;
    const { slot_id, vehicle_id, start_time, end_time, booking_duration_hours, total_cost } = req.body;
 
   
    await client.query('BEGIN');

    
    const conflictCheckQuery = `
      SELECT booking_id FROM bookings
      WHERE slot_id = $1 AND 
      (start_time, end_time) OVERLAPS ($2, $3)
    `;
    

    const conflictingBooking = await client.query(conflictCheckQuery, [slot_id, start_time, end_time]);

    if (conflictingBooking.rows.length > 0) {
      
      await client.query('ROLLBACK'); 
      return res.status(409).json({ 
        success: false, 
        error: "This slot is already booked for the selected time. Please try another slot or time." 
      });
    }

   
    const insertQuery = `
      INSERT INTO bookings (slot_id, user_id, vehicle_id, start_time, end_time, booking_duration_hours, total_cost, reminder_sent) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, false) 
      RETURNING *
    `;
    const result = await client.query(insertQuery, [slot_id, user_Id, vehicle_id, start_time, end_time, booking_duration_hours, total_cost]);
    
   
    await client.query('COMMIT');

    const booking = result.rows[0];
   
    const notificationPayload={
         id:`booking-${booking.booking_id}`,
         type:'booking',
         message:`Your booking for slot ${booking.slot_id} is confirmed! `,
         created_at: new Date().toISOString(),
    }

    getIo().to(user_Id.toString()).emit("new-notification",notificationPayload);

   
    scheduleReminder({
      booking_id: booking.booking_id,
      end_time: booking.end_time,
      email: req.user.email
    });

    getIo().emit("slotBooked", {
      slot_id: booking.slot_id,
      start_time: booking.start_time,
      end_time: booking.end_time,
      user_id: booking.user_id
    });

    res.status(201).json({ success: true, booking });

  } catch (err) {
   
    await client.query('ROLLBACK');
    console.error("Error creating booking:", err);
    res.status(500).json({ success: false, error: "Failed to create booking" });
  } finally {
   
    client.release();
  }
});

module.exports = router;