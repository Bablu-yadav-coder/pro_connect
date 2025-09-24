import mongoose from "mongoose";
const {Schema} = mongoose;

const commentSchema = Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }, 
    postId : {
        type : Schema.Types.ObjectId,
        ref : "Post"
    }, 
    body : {
        type : String,
        default : "",
    }, 
    createdAt : {
        type : Date,
        default : new Date()
    }
});

const Comment = mongoose.model("Comment", commentSchema);

export default  Comment;