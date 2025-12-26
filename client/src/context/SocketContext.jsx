import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = "http://localhost:5000"; 
const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const newSocket = io(BACKEND_URL, {
       
        auth: { token }
      });
      setSocket(newSocket);

     
      return () => newSocket.close();
    }
  }, []); 

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};