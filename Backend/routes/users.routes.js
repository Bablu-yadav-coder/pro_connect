import {Router} from "express";
import {getUserProfile, login, register, updateUserProfile,updateProfilePicture, updateProfileData, getAllUsers, downloadUserProfile, sendConnectionRequest, getMyConnectionRequest, myAllConnection, acceptConnectionReq, getUserBasedOnUsername, MyNework} from "../controllers/users.controller.js"
const router = Router();
import multer from "multer";
// import { uploads } from "../cloudConfig.js";


const storage = multer.diskStorage({
    destination : (req,file, cb) => {
        cb(null, "uploads/");
    },
    
    filename : (req,file, cb) => {
        cb(null, file.originalname);
    }
});

const uploads = multer({storage : storage});


router.route("/update_profile_picture")
.post(uploads.single("profile_picture"), updateProfilePicture);

router.route("/register").post(register);
router.route("/login").post(login);

router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_users").get(getAllUsers);
router.route("/user/download_resume").get(downloadUserProfile);

router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequest").get(getMyConnectionRequest);
router.route("/user/user_connection_request").get(myAllConnection);
router.route("/user/accept_connection_request").post(acceptConnectionReq);

router.route("/user/get_user_based_on_username").get(getUserBasedOnUsername);



router.route("/mynetwork/user").get(MyNework);




export default router; 