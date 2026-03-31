import { Router } from "express";
import { registerUser, loginUser, logoutUser, updatecurrentUser,updatecurrentUserCoverImage,updatecurrentUserAvatar,updatecurrentUser,changeCurrentPassword,getUserChannelProfile,getUserWatchHistory,getUserChannelProfile,getcurrentUser,refreshaccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    registerUser);
router.route("/login").post(loginUser);  
//secured routes
router.route("/logout").post(verifyJWT, logoutUser); 
// is me jab hum 2 func denge to router confuse ho jata kei konsa pahle run karu to isliye hum kop next() dalte hai taki wo dono func run kar sake aur jab bhi hum logout route ko hit kare to pehle verifyJWT middleware run hoga aur uske baad logoutUser function run hoga
router.route("/refresh-token").post(refreshaccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-account").patch(verifyJWT,updatecurrentUser)
router.route("/current-user").get(verifyJWT, getcurrentUser)
router.route("/avatar").patch(verifyJWT,upload.single('avatar'), updatecurrentUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single('coverImage'), updatecurrentUserCoverImage)
router.route("/c/:username/channel-profile").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getUserWatchHistory)
export default router;