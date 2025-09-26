import User from "../models/user.model.js"
import Profile from "../models/profile.model.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connection.model.js";







const convertUserProfileToPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath = await crypto.randomBytes(32).toString("hex") + ".pdf";

  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePic}`, { align: "center", width: 100 });
  doc.fontSize(14).text(" ");

  doc.fontSize(14).text(`Name : ${userData.userId.name}`);
  doc.fontSize(14).text(`Username : ${userData.userId.username}`);
  doc.fontSize(14).text(`Email : ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio : ${userData.bio}`);
  doc.fontSize(14).text(`Current Position : ${userData.currentPost}`)


  doc.fontSize(14).text("Past Work : ")
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Comapany Name : ${work.company}`)
    doc.fontSize(14).text(`Position : ${work.position}`);
    doc.fontSize(14).text(`Years : ${work.years}`)
  });


  doc.fontSize(14).text("Education : ")
  userData.education.forEach((edu, idx) => {
    doc.fontSize(14).text(`College : ${edu.school}`);
    doc.fontSize(14).text(`Degree : ${edu.degree}`);
    doc.fontSize(14).text(`Fields : ${edu.fieldOfStudy}`)
  });

  doc.end();

  return outputPath;

}


export const register = async (req, res) => {

  try {

    const { name, email, username, password } = req.body;



    if ((!name || !email) || (!username || !password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });

    await profile.save();


    return res.status(201).json({ message: "User registerd Please Login!" , user});

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};





export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({ message: "All fields required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message : "user not exists" });
    }

    const match =await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(404).json({ message: "Invalid credentials" })
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });

   

    return res.status(200).json({  token : token, message : "Welcome Back!"});


  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};




// update profile picture of user using multer;

export const updateProfilePicture = async (req, res) => {


  const { token } = req.body;

  try {


    const user = await User.findOne({ token: token });
    

    if (!user) {
      return res.status(400).json({ message: "User not exists" });
    }


    user.profilePic = req.file.filename;

    await user.save();

    return res.json({ message: "profile pic updated!" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }


}


// update user profile (ex. name , email)

export const updateUserProfile = async (req, res) => {
  
  

  const { token, ...newUserData } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(400).json({ message: "User not exists" });
    }

    

    // check if already user not exists in the database 

    const { email, username } = newUserData;

    const existing = await User.findOne({ $or: [{ username }, { email }] });


    //   if updated data (of a user) same as another user and id differnt we cannot update data
    if(existing) {
      if (existing || String(existing._id) !== String(user._id)) {
        return res.json({ message: "User already exists" });
      }
    }

    Object.assign(user, newUserData);

    await user.save();

    return res.json({ message: "User updated" });

  } catch (err) {
    return res.json({ message: err.message })
  }
};





// get user and profile

export const getUserProfile = async (req, res) => {

  try {
    const { token } = req.query;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(400).json({ message: "User not exists" });
    }

    const userProfile = await Profile.findOne({ userId: user._id })
      .populate("userId", "name email username profilePic");


    return res.json(userProfile);


  } catch (err) {
    return res.json({ message: err })
  }
};




// update profile data [ex . education, bio, experience]


export const updateProfileData = async (req, res) => {

  try {
    const { token, ...newProfileData } = req.body;

    

    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(400).json({ message: "User not exists" });
    }

    const profile_to_update = await Profile.findOne({ userId: userProfile._id }).populate("userId")

    Object.assign(profile_to_update, newProfileData);

    await profile_to_update.save();

    return res.json({ message: "updated profile data" });

  } catch (err) {
    return res.json({ message: err })
  }
};



// get all user from DB


export const getAllUsers = async (req, res) => {

  try {

    const profiles = await Profile.find().populate("userId", "name username email profilePic ");

    return res.json(profiles);
  } catch (err) {
    return res.status(400).json({ message: err })
  }
}




// download user profile 

export const downloadUserProfile = async (req, res) => {
  
  const user_id = req.query.id;


  const userProfile = await Profile.findOne({ userId: user_id })
    .populate("userId", "name email username profilePic");




  const outputPath = await convertUserProfileToPDF(userProfile);

  return res.json({ "message": outputPath });

}




// send connection request 

export const sendConnectionRequest = async (req, res) => {

  const { token, connectionId } = req.body;

  /// connectionId --> request receiver Id 
  //   userId = --> sender Id
  // token  ---> request sender token

  try {

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }


    const connectionUser = await User.findOne({_id: connectionId });

    if (!connectionId) {
      return res.status(400).json({ message: "User not found" });
    }


    const existingRequest = await ConnectionRequest.findOne(
      {
        userId: user._id,
        connectionId: connectionUser._id
      }
    )

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }


    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id
    })

    await request.save();



    return res.json({ message: "connection sent" })



  } catch (err) {
    return res.json({ message: err.message });
  }

}



//  get all my connection request that i sent


export const getMyConnectionRequest = async (req, res) => {

  const { token } = req.query;

  try {

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // find my all connnection request // that i sent  but here i am sender ///  so this find my all connection req

    const connections = await ConnectionRequest.find({ userId: user._id })
      .populate("connectionId", "name email username profilePic");

    return res.json(connections);

  } catch (err) {
    return res.json({ messge: err.message });
  }
}

// connection requset from other users 

export const myAllConnection = async (req, res) => {

  const { token } = req.query;
  try {

    const user = await User.findOne({token });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // here find all user that send to me a connection requset.  this is my connection/network  
    // $or : [{connectionId: user._id} , {userId : user._id}]

    const connections = await ConnectionRequest.find({ connectionId : user._id })
          .populate("userId", "name email username profilePic");



    return res.json(connections);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


// accept connetion request 


export const acceptConnectionReq = async (req, res) => {


  const { token, requestId, action_type } = req.body;


  try {

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }



    const connection = await ConnectionRequest.findOne({ userId: requestId });

    if (!connection) {
      return res.status(400).json({ message: "connection user not found" });
    }


   await ConnectionRequest.findOneAndUpdate({$and : [{ userId : requestId },{ connectionId : user._id}]}, {$set : {status_accepted : action_type === "accept"}});


    return res.json({ message: "request Updated" })

  } catch (err) {
    return res.json({ messge: err.message });
  }
}








export const getUserBasedOnUsername = async(req,res) => {

  try {

    const {username} = req.query;



    const user = await User.findOne({username : username});

    if(!user) {
      return res.status(404).json({message : "user not found"})
    }


    const profile = await Profile.findOne({userId : user._id}).populate("userId", "name email profilePic username");

 

    if(!profile) {
      return res.status(404).json({message : "Profile not found"})
      
    }


    return res.status(200).json(profile);
    
    
     
  } catch(err ) {

    return res.status(500).json({message : err.message})
  }
}




export const MyNework = async(req,res) => {

  const {token} = req.query;

  try {

    const user = await User.findOne({token});


   if(!user) {
    return res.json({mssage : "User Not found"});
   }

   const network = await ConnectionRequest({$and : [{status_accepted : true}, {$or : [{userId : user._id}, {connetionId : user._id}]}]   } )
        .populate("connectionId", "name username profilePic ");



   return res.json(network);

  } catch(err) {
    return res.json({message : err.message});
  }


}