import { createSlice } from "@reduxjs/toolkit"
import { getAllMessages } from "../../action/socket/socketAction";

const initialState = {
    onlineUsers: [],
    messages: [],
    selectedUser : null,
    likeNotification : [],
}

const socketSlice = createSlice({
    name: 'socketio',
    initialState,
    reducers: {
        // actions
        

        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        },

        setMessages: (state, action) => {
            state.messages = action.payload;

        },
        setSelectedUser : (state, action) => {
            state.selectedUser =  action.payload
        },

        setLikeNotification:(state,action)=>{

            console.log(action.payload)

            if(action.payload.type === 'like'){
                state.likeNotification.push(action.payload);
            }else if(action.payload.type === 'dislike'){
                state.likeNotification = state.likeNotification.filter((item)=> item.userId !== action.payload.userId);
            }
        }

    },

    extraReducers : (builder) => {
        builder 

        .addCase(getAllMessages.fulfilled, (state, action) => {
            state.messages = action.payload
        })
    }
})



export const { setSocket, setOnlineUsers, setMessages, setSelectedUser, setLikeNotification } = socketSlice.actions;
export default socketSlice.reducer;