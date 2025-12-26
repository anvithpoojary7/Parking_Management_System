const cron = require("node-cron");
const pool = require("../config/db");
const sendMail = require("../utils/utils");

function scheduleReminder(booking) {
  const endTime = new Date(booking.end_time);
  const reminderTime = new Date(endTime.getTime() - 60 * 60 * 1000); 
  const now = new Date();

  if (reminderTime <= now && endTime > now) {
  
    console.log(
      `⚠️ Reminder time already passed for booking ${booking.booking_id}. Sending immediate reminder.`
    );

    sendMail(
      booking.email,
      "Parking Reminder",
      "Please collect your vehicle. A penalty will be charged if you don’t."
    )
      .then(async () => {
        await pool.query(
          "UPDATE bookings SET reminder_sent = true WHERE booking_id = $1",
          [booking.booking_id]
        );
        console.log(`📧 Immediate reminder sent for booking ${booking.booking_id}`);
      })
      .catch((err) => {
        console.error("❌ Error sending immediate reminder:", err);
      });

    return;
  }

  if (endTime <= now) {
 
    console.log(`⏹️ Booking ${booking.booking_id} already ended. Skipping reminder.`);
    return;
  }

  
  const minute = reminderTime.getMinutes();
  const hour = reminderTime.getHours();
  const day = reminderTime.getDate();
  const month = reminderTime.getMonth() + 1;

  const cronExpression = `${minute} ${hour} ${day} ${month} *`;

  console.log(
    `🕒 Scheduling reminder for booking ${booking.booking_id} at ${reminderTime.toString()} (IST)`
  );

  cron.schedule(cronExpression, async () => {
      try {
        await sendMail(
          booking.email,
          "Parking Reminder",
          "Please collect your vehicle. A penalty will be charged if you don’t."
        );

        await pool.query(
          "UPDATE bookings SET reminder_sent = true WHERE booking_id = $1",
          [booking.booking_id]
        );

        console.log(`📧 Reminder sent for booking ${booking.booking_id}`);
      } catch (err) {
        console.error("❌ Error sending reminder:", err);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
}

module.exports = scheduleReminder;
