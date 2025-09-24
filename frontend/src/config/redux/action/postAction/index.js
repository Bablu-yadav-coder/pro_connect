import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";




export const getAllPost = createAsyncThunk(
    "post/posts",

    async (_, thunkAPI) => {

        try {

            const response = await clientServer.get("/posts");

            return thunkAPI.fulfillWithValue(response.data);
        }

        catch (err) {

            return thunkAPI.rejectWithValue(err.response.data);
        }

    }

);



export const createPost = createAsyncThunk(
    "post/createPost",

    async (userData, thunkAPI) => {

        const { file, body } = userData;

        try {   
            //  console.log(userData)
        
            const formData = new FormData();

            formData.append("token", localStorage.getItem("token"));
            formData.append("body", body)
            formData.append("media", file)


            const response = await clientServer.post("/posts/new", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("Post uploaded");
            } else {
                return thunkAPI.rejectWithValue("post not uploaded")
            }

        }

        catch (error) {

            return thunkAPI.rejectWithValue(error.response.message);
        }
    }
);





export const deletePost = createAsyncThunk(
    "post/deletePost",

    async (_post, thunkAPI) => {


        try {

            const response = await clientServer.delete("/posts", {
                data: {
                    token: _post.token,
                    postId: _post.postId
                }
            });


            console.log(response.data);

            return thunkAPI.fulfillWithValue(response.data);


        } catch (err) {

            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)




export const increaseLikes = createAsyncThunk(
    "post/increaseLikes",

    async (post_id, thunkAPI) => {


        try {

            const response = await clientServer.put("/posts/likes", {
                postId: post_id.postId,
                token : localStorage.getItem("token")
            });

            return thunkAPI.fulfillWithValue(response.data)

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)





export const getComments = createAsyncThunk(
    "post/getCommmets",

    async (postData, thunkAPI) => {


        try {

            const response = await clientServer.get("/posts/allComments", {
                params: {
                    postId: postData.postId,
                }
            });


            return thunkAPI.fulfillWithValue({
                comments: response.data,
                postId: postData.postId
            })

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }

    }
)



export const addNewComment = createAsyncThunk(
    "post/addNewComment",

    async (commentData, thunkAPI) => {


        try {

            const response = clientServer.post("/posts/newComment", {
                token: commentData.token,
                comment: commentData.comment,
                postId: commentData.postId

            })

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)




export const deleteComment = createAsyncThunk(
    "post/deleteComment",

    async (user, thunkAPI) => {

        console.log(user);
        try {

            const response = await clientServer.delete("/posts/comments", {

                data: {
                    token: user.token,
                    commentId: user.commentId
                }

            });


            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)