import { setLikeNotification, setOnlineUsers } from '@/config/redux/reducer/socketReducer';
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

      // socketio.on('notification', (notification) => {

      //   console.log(" notification recived")
      //   dispatch(setLikeNotification(notification));
      // });


      return () => {
        socketio.close();
      }


    }
  }, [authState.user, dispatch, setLikeNotification]);



  return children;

}



