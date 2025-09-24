
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"
import postReducer from "./reducer/postReducer"
import socketReducer from "./reducer/socketReducer"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
        socketio: socketReducer,

    }
})



