import {createSlice} from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionRequest, getMessageParticipantsUser, getMyConnections, loginUser, registerUser, searchUser, sendConnectionRequest } from "../../action/authAction";


const initialState = {
    user : undefined,
    isError : false,
    isSuccess : false,
    isLoading : false,
    loggedIn : false,
    message : "",
    isTokenThere  : false,
    profileFetched : false,
    connections : [],
    connectionRequest : [],
    all_users : [],
    all_profiles_fetched  : false,
    getMessageParticipants : []
    
}


const authSlice =  createSlice({
    name : "auth",
    initialState,
    reducers : {
        reset :  () => initialState,
        

        emptyMessage : (state) => {
            state.message = ""
        },

        setTokenIsThere : (state) => {
            state.isTokenThere = true;
        },

        setTokenIsNotThere : (state) => {
            state.isTokenThere = false;
        }
        


    },

    extraReducers  : (builder) => {
        builder 
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message  = "knocking the door...."
                
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.message = "Welcome back!"
                
            })

            .addCase(loginUser.rejected, (state,action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;

            })

            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Registering you";
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.message  = action.payload.message
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message =   action.payload.message;
            })


            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.profileFetched = true;
                state.user = action.payload;
            })


            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess  =true;
                state.all_profiles_fetched = true;
                state.all_users = action.payload;
            })


            .addCase(getConnectionRequest.fulfilled, (state, action) =>{
                state.connections = action.payload
            })
            
            .addCase(getConnectionRequest.rejected, (state, action) =>{
                state.message = action.payload.message
            })


            .addCase(getMyConnections.fulfilled, (state, action) => {
                state.connectionRequest = action.payload
            })

            .addCase(getMyConnections.rejected, (state, action) => {
                state.message = action.payload
            })


            .addCase(searchUser.fulfilled, (state, action) => {
                state.all_users = [action.payload];
              
            })

            .addCase(getMessageParticipantsUser.fulfilled, (state, action) => {
                state.getMessageParticipants = action.payload
            })



    }

})


export const {reset, emptyMessage, setTokenIsNotThere, setTokenIsThere} = authSlice.actions;

export default authSlice.reducer; 