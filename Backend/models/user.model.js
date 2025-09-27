import mongoose from "mongoose";
import Profile from "./profile.model.js";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    profilePic: {
        type: String,
        default: "default.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default: "",
    }
});


userSchema.post("findOneAndDelete", async (deletedUser) => {
    if (deletedUser) {

       await Profile.deleteOne({ userId: deletedUser._id })

    }
})




const User = mongoose.model("User", userSchema);




export default User;