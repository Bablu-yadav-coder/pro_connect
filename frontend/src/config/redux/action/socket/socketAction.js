import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";


export const getAllMessages = createAsyncThunk(
    "scoketio/getAllMesssges", 
    async (data, thunkAPI) => {
        try {

            const response = await clientServer.post("/get_messages", {
                receiverId : data.receiverId,
                token : localStorage.getItem("token")
            })



        return thunkAPI.fulfillWithValue(response.data.message);
        } catch(err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)