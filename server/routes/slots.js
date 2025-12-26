/*// parksmart-backend/routes/slots.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    const { location, date, time, duration } = req.query;

    if (!location || !date || !time || !duration) {
        return res.status(400).json({
            message: 'Missing query parameters: location, date, time, duration are required.'
        });
    }

    try {
        // Parse date, time, and duration
        const startTime = new Date(`${date}T${time}:00`);
        const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

        // 1. Get location_id
      const locationResult = await pool.query(
      'SELECT location_id FROM locations WHERE LOWER(name) = LOWER($1)',
       [location]
      );
        if (locationResult.rows.length === 0) {
            return res.status(404).json({ message: "Location not found." });
        }
        const locationId = locationResult.rows[0].location_id;

        // 2. Query all active parking slots in that location whose bookings DO NOT overlap with requested time
        const query = `
            SELECT
                ps.slot_id,
                ps.slot_number AS name,
                ps.is_active,
                ps.slot_type,
                ps.rate_per_hour,
                l.name AS location_name,
                s.name AS sublocation_name
            FROM
                parking_slots ps
            JOIN
                sublocations s ON ps.sublocation_id = s.sublocation_id
            JOIN
                locations l ON s.location_id = l.location_id
            WHERE
                l.location_id = $1
                AND ps.is_active = TRUE
                AND ps.slot_id NOT IN (
                    SELECT b.slot_id
                    FROM bookings b
                    WHERE
                        b.start_time < $3
                        AND b.end_time > $2
                );
        `;

        const result = await pool.query(query, [locationId, startTime.toISOString(), endTime.toISOString()]);

        const formattedSlots = result.rows.map(slot => {
            const features = [{ text: slot.slot_type }];

            if (slot.slot_type === 'EV') {
                features.push({ text: 'EV Charging', icon: '⚡' });
            }
            if (slot.slot_type === 'Covered') {
                features.push({ text: 'Covered' });
            }
            if (slot.slot_type === 'Compact') {
                features.push({ text: 'Compact' });
            }
            if (slot.slot_type === 'Large' || slot.slot_type === 'SUV') {
                features.push({ text: 'SUV' });
            }

            return {
                id: slot.slot_id,
                name: slot.name,
                available: true,
                rating: 4.0, // Optional placeholder
                features,
                distance: parseFloat((Math.random() * 0.5 + 0.1).toFixed(1)), // Random for now
                hourlyRate: parseFloat(slot.rate_per_hour),
                duration: parseInt(duration),
                totalRate: parseFloat(slot.rate_per_hour) * parseInt(duration),
                locationName: slot.location_name,
                sublocationName: slot.sublocation_name
            };
        });

        res.json(formattedSlots);
    } catch (err) {
        console.error('Error fetching available slots:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

module.exports = router;*/
