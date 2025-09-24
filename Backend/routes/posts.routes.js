import { Router } from "express";
import multer from "multer";
import { addNewComment, createPost,  deleteComment, deletePost, deleteProfileData, deleteProfileWork, getAllComments, getAllPosts, incrementLikes } from "../controllers/posts.controller.js";
// import multer from "multer";

const router = Router();







const storage = multer.diskStorage({
    destination : (req,file, cb) => {
        cb(null, "uploads/");
    },
    
    filename : (req,file, cb) => {
        cb(null, file.originalname);
    }
});

const uploads = multer({storage : storage});




router.route("/new").post(uploads.single("media"),createPost);


router.route("/hello").post(uploads.single('media'), (req, res) => {
    console.log(req.file)
    console.log(req.body)

    res.send(req.body)
})

router.route("/").get(getAllPosts);
router.route("/").delete(deletePost);
router.route("/newComment").post(addNewComment);
router.route("/allComments").get(getAllComments);
router.route("/comments").delete(deleteComment);
router.route("/likes").put(incrementLikes);

router.route("/delete_post_data").post(deleteProfileData);
router.route("/delete_pastwork").post(deleteProfileWork)


export default router;