import mongoose from "mongoose";
const { Schema } = mongoose
import Comment from "./comment.model.js";

const postSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    body: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref : "User",
        default : [],
    }],
    createdAt: {
        type: Date,
        default: Date.now,

    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },

    media: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: true
    },
    fileType: {
        type: String,
        default: ""
    }

});


postSchema.post("findOneAndDelete", async (deletePost) => {
    await Comment.deleteMany({ postId: deletePost._id });
});


const Post = mongoose.model("Post", postSchema);

export default Post;

