const express=require('express');
const app=express();
const pool=require('./config/db');
const cookieParser=require('cookie-parser')
const authRoutes = require('./routes/auth');
const signuproute=require("./routes/signuproute");
const dotenv=require('dotenv');
const maproutes=require('./routes/mapRoutes');
const vehicleavailability=require('./routes/vehicleavailablity');
const availability=require('./routes/parkingavailabity');
const bookingRoute=require('./routes/bookings');
const notificationRoutes = require('./routes/notifications');

const { initSocket } = require("./socket");
const http=require('http');

require('dotenv').config();


const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

require("./jobs/reminderJobs");


app.use(express.json());

app.use(cookieParser());

app.use('/api/auth' ,authRoutes);

app.use('/api/signup',signuproute);

app.use('/api/searchslots/',availability);

app.use('/api',maproutes);

app.use('/api/vehicles',vehicleavailability);

app.use('/api',bookingRoute);



app.use('/api/notifications', notificationRoutes);




app.use((req, res) => {
  console.log(`🚨 Unknown route hit: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Not Found' });
});

const server = http.createServer(app);

initSocket(server);

server.listen(5000, () => {
  console.log(`🚀 Server is running with WebSocket on http://localhost:5000`);
});

