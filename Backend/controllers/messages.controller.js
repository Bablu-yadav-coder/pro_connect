import Conversation from "../models/conversational.model.js";
import Message from "../models/messages.model.js"
import User from "../models/user.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    // const senderId = req.user._id;
    // const receiverId = req.params.id;
    // const {message} = req.body;


    const { receiverId, token, message } = req.body;


    const senderId = await User.findOne({ token }).select("_id");

    if (!senderId) {
        return res.json({ message: "user not defind" });
    }

    if(!receiverId) {
        return res.json({ message: "receiverId not defind" });

    }



    let conversation = await Conversation.findOne({
        participants: { $all: [receiverId, senderId] }
    });

    // establish new conversation
    if (!conversation) {
        conversation = new Conversation({
            participants: [receiverId, senderId]
        })
    }

    const newMessage = new Message({
        senderId : senderId.id,
        receiverId,
        message
    });

    if (newMessage) {
        conversation.messages.push(newMessage);
    }

    await newMessage.save();
    await conversation.save();
    // implement socket io for responsive

    // messages send by socket _id, so we have to find socket id of receiver


    const receiverSocketId = getReceiverSocketId(receiverId);

    

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }



   
    res.status(200).json({
        message: "establish conversation",
        success: true,
        newMessage,
    })
};


export const getMessage = async (req,res) => {

    const { receiverId, token } = req.body;

    const senderId = await User.findOne({ token }).select("_id");

    if (!senderId) {
        return res.json({ message: "user not defind" });
    }


    const conversation = await Conversation.findOne({
        participants: { $all: [receiverId, senderId] }
    }).populate("messages");

    if (!conversation) {
        return res.status(200).json({
            success: true,
            message: [],
        })
    }

    return res.status(200).json({
        success: true,
        message: conversation?.messages
    })
} 



export const getConnections = async (req,res) => {

    const {  token } = req.body;

    const userId = await User.findOne({ token }).select("_id");

    if (!userId) {
        return res.json({ message: "user not defind" });
    }


    const conversation = await Conversation.find({
        participants: { $all: [userId] }
    }).populate('participants')

    if (!conversation) {
        return res.status(200).json({
            success: true,
            message: [],
        })
    }

    return res.status(200).json({
        success: true,
        conversation
    })
} 