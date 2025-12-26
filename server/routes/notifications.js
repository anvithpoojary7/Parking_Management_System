const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifytoken = require('../middleware/authMiddleware');


router.get('/', verifytoken, async (req, res) => {
    try {
        const userId = req.user.id;
    
        const query = `
            SELECT 
                'booking-' || booking_id as id,
                'booking' as type,
                'Your booking for slot ' || slot_id || ' is confirmed! ' as message,
               booked_at as created_at,
                is_read
            FROM bookings
            WHERE user_id = $1
            ORDER BY booked_at DESC;
        `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/mark-read', verifytoken, async (req, res) => {
    try {
        const userId = req.user.id;
    
        const query = `UPDATE bookings SET is_read = TRUE WHERE user_id = $1;`;
        await pool.query(query, [userId]);
        res.status(200).json({ message: "All notifications marked as read." });
    } catch (err) {
        console.error("Error marking notifications as read:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;