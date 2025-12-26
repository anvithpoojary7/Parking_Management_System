import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SocketProvider } from './context/SocketContext';


import Dashboard from './components/Dashboard/Dashboard';
import DashboardHome from './components/Dashboard/DashboardHome';
import BookSlot from './components/Dashboard/BookSlot';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Location from './components/Location';
import Login from './components/Login';
import ParkingSlots from './components/ParkingSlot';
import Signup from './components/Signup';
import Notification from './components/Dashboard/Notification';
import ConfirmBooking from './components/Dashboard/ConfirmBooking';
import BookingSuccess from './components/Dashboard/BookingSuccess';

function Homepage() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
    </>
  );
}

function App() {
  return (
    // 2. Wrap the Router with the SocketProvider
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<><Navbar /><Homepage /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
          <Route path="/home" element={<><Navbar /><Homepage /><Footer /></>} />
          <Route path="/location" element={<><Navbar /><Location /><Footer /></>} />
          <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
          <Route path="/parkingslots" element={<><Navbar /><ParkingSlots /><Footer /></>} />
          <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />

          {/* Dashboard layout and children */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="bookslot" element={<BookSlot />} />
            <Route path="notifications" element={<Notification/>}/>
            <Route path="confirmreservation" element={<ConfirmBooking/>}/>
            <Route path="booking-success" element={<BookingSuccess />} />
          </Route>
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;