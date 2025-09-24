import mongoose from "mongoose";

const educationSchema = mongoose.Schema( {
    school : {
        type : String,
        
    }, 
    degree : {
        type : String,
        default : ""
    },
    fieldOfStudy : {
        type : String
    }
});


const workSchema  = mongoose.Schema({
    position : {
        type : String,
    },
    company : {
        type : String,
    }, 
    years : {
        type : String,
    }
});




const profileSchema = mongoose.Schema ({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "User"
    }, 
    bio : {
        type : String,
        default : "",
    }, 
    currentPost : {
        type : String,
        default : "",

    },
    pastWork : {
        type : [workSchema],
        default : []
    }, 
    education : {
        type : [educationSchema],
        default : []
    }
});


const Profile = mongoose.model("Profile", profileSchema);

export default Profile;