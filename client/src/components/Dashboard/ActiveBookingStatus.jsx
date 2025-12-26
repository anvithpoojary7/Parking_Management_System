import React,{useState,useEffect} from 'react';
import io from 'socket.io-client';

import './ActiveBookingStatus.css';

const BACKEND_URL='http://localhost:5000';

const ActiveBookingStatus = () => {
  const[liveBooking,setLiveBooking]=useState(null);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState(null);


  useEffect(()=>{
       
        const fetchLiveStatus=async()=>{
              try{
                 const token=localStorage.getItem('token');
                 if(!token){
                     throw new Error("authentication token not found");

                 }

                 const response=await fetch(`${BACKEND_URL}/api/bookings/live`,{
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                 });

                 if(!response.ok){
                     const errorData = await response.json(); 
             throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                  const data=await response.json();
                 setLiveBooking(data);

                 }
                catch(err){
                 setError(err.message);
        console.error("Error fetching live status:", err);
              }
              finally{
                  setLoading(false);
              }

              }
              fetchLiveStatus();
            const socket=io(BACKEND_URL);
            socket.on('parkingStatusUpdate',(updatedBooking)=>{
                console.log('recieved live update',updatedBooking);
                setLiveBooking(updatedBooking);
                setError(null);

            })
            return ()=>{
              socket.disconnect();

            }

        },[]);
          const renderTableBody = () => {
    if (loading) {
      return <tr><td colSpan="5">Loading...</td></tr>;
    }

    if (error && !liveBooking) {
      return <tr><td colSpan="5">{error}</td></tr>;
    }
    
    if (liveBooking) {
      return (
        <tr>
          <td>{liveBooking.vehicle}</td>
          <td>{liveBooking.slot}</td>
          <td>{liveBooking.location}</td>
          <td className="status-complete">{liveBooking.status}</td>
          <td>{liveBooking.time}</td>
        </tr>
      );
    }

    return <tr><td colSpan="5">No active booking information available.</td></tr>;
  };

  return (
     <div className="active-bookings">
      <h3>Live Parking Status</h3>
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Slot</th>
            <th>Location</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {renderTableBody()}
        </tbody>
      </table>
    </div>
  );
};
export default ActiveBookingStatus;
