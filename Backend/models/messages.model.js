import mongoose from "mongoose";
const Schema = mongoose.Schema;


const msgSchema = new Schema({
    senderId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }, 
    receiverId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    message : {
        type : String,
        required : true
    }
})

 const Message = mongoose.model("Message", msgSchema);
export default Message;
