import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const loginUser = createAsyncThunk(
    "user/login",

    async (user, thunkAPI) => {


        try {

            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                return thunkAPI.rejectWithValue({
                    message: "Token not provided",
                });
            }

            return thunkAPI.fulfillWithValue(response.data.token);

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);

        }
    }
)


export const registerUser = createAsyncThunk(
    "user/register",

    async (user, thunkAPI) => {

        try {

            const response = await clientServer.post("/register", {
                email: user.email,
                username: user.username,
                name: user.name,
                password: user.password
            })

            console.log(response.data)

            return thunkAPI.fulfillWithValue(response.data);

        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }


    }

);



export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {

        try {

            const response = await clientServer.get("/get_user_and_profile", {
                params: {
                    token: user.token
                }
            });


            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
);



export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",

    async (_, thunkAPI) => {

        try {


            const response = await clientServer.get("/user/get_all_users");


            console.log(response.data)
            return thunkAPI.fulfillWithValue(response.data)



        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }

    }
)


export const updateUser = createAsyncThunk(
    "user/updateUser",

    async (user, thunkAPI) => {


        try {

            const response = await clientServer.post("/user_update", {
                ...user
            });


            return thunkAPI.fulfillWithValue(response.data)



        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }

    }
)





export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",

    async (user, thunkAPI) => {

        try {

            const response = await clientServer.post("/user/send_connection_request", {
                token: user.token,   /// token --> login user 
                connectionId: user.userId   // userId --> jis user ki profile open ki hai
            });

            thunkAPI.dispatch(getConnectionRequest({ token: user.token }));

            return thunkAPI.fulfillWithValue(response.data);


        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)



export const getConnectionRequest = createAsyncThunk(
    "user/getConnectionRequest",

    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/getConnectionRequest", {
                params: {
                    token: user.token
                }
            });

            return thunkAPI.fulfillWithValue(response.data)


        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)





export const getMyConnections = createAsyncThunk(
    "user/getMyConnections",

    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get("/user/user_connection_request", {
                params: {
                    token: user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)




export const acceptConnection = createAsyncThunk(
    "user/acceptConnection",

    async (user, thunkAPI) => {

        console.log(user)


        try {
            const response = await clientServer.post("/user/accept_connection_request", {
                token: user.token,
                requestId: user.connectionId,
                action_type: user.action
            })

            await thunkAPI.dispatch(getConnectionRequest({ token: user.token }));
            await thunkAPI.dispatch(getMyConnections({ token: user.token }));


            return thunkAPI.fulfillWithValue(response.data)

        } catch (err) {

            return thunkAPI.rejectWithValue(err.response.data)
        }

    }
)



export const searchUser = createAsyncThunk(
    "user/searchUser",

    async (user, thunkAPI) => {

        console.log(user.username)

        try {
            const response = await clientServer.get("/user/get_user_based_on_username", {
                params: {
                    username: user.username
                }
            })

            return thunkAPI.fulfillWithValue(response.data)

        } catch (err) {

            return thunkAPI.rejectWithValue(err.response.data)
        }

    }
)




export const getMessageParticipantsUser = createAsyncThunk(
    "user/getMessageUser",

    async (_, thunkAPI) => {


        try {

            const response = await clientServer.post("/get_message_connection", {
                token: localStorage.getItem("token")
            })

            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {

            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)





