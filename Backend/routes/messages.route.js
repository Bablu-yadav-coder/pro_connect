import { Router } from "express";
import { getConnections, getMessage, sendMessage } from "../controllers/messages.controller.js";

const router = Router();


router.route("/send_messages").post(sendMessage);
router.route("/get_messages").post(getMessage);
router.route("/get_message_connection").post(getConnections);


export default router;