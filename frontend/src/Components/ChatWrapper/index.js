import {setOnlineUsers } from '@/config/redux/reducer/socketReducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import  { initSocket } from './socket';

export default function ChatWrapper({ children }) {


  const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();



  useEffect(() => {
    if (authState.user) {
      const socketio = initSocket(authState.user.userId._id);

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      })



      return () => {
        socketio.close();
      }


    }
  }, [authState.user, dispatch]);



  return children;

}



