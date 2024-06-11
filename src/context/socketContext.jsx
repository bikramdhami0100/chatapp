"use client";
import Cookies from 'js-cookie';
 // Correct importi
 import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null); // Correct camelCase
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const authUser = Cookies?.get("token");
    console.log(authUser)
    const decodedToken = jwtDecode(authUser);
      const userId = decodedToken.userId;
    //   console.log(userId);
    if (userId) {
      
      setUserId(userId);

      const newSocket = io('http://localhost:8000', { // Correct port number
        query: {
          userId: userId,
        },
      });
     

      setSocket(newSocket);
      // setSocket(newSocket);

      // return () => newSocket.close();
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, userId,setSocket ,messages}}>
      {children}
    </SocketContext.Provider>
  );
};
