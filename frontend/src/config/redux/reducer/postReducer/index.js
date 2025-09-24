import { createSlice } from "@reduxjs/toolkit"
import { deleteComment, getAllPost, getComments, increaseLikes } from "../../action/postAction"



const initialState = {
    post: [],
    isError: false,
    isLoading: false,
    postFetched: false,
    loggedIn: false,
    message: "",
    comments: [],
    postId: "",
}


const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,

        resetPostId: (state) => {
            state.postId = ""
        }
    },

    extraReducers: (builder) => {
        builder

            .addCase(getAllPost.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching  all the post"

            })

            .addCase(getAllPost.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.postFetched = true;
                state.post = action.payload.reverse();
            })

            .addCase(getAllPost.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.message = action.payload
            })

            .addCase(getComments.fulfilled, (state, action) => {
                state.postId = action.payload.postId;
                state.comments = action.payload.comments
            })

            .addCase(deleteComment.fulfilled, (state, action)  => {

                console.log(action.payload)
            })

            .addCase(increaseLikes.fulfilled, (state, action ) => {
                const {postId, likesCount} = action.payload;

                let post = state.post.find(p => p._id === postId);

                if(post) {
                    post.likes = likesCount;
                }
            })
    }
})


export const { resetPostId } = postSlice.actions;


export default postSlice.reducer;