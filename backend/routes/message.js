import express from 'express';
import validateuser from '../middleware/validateUser.js';
import { sendMessage, getMessage } from '../controller/messages/message.js';

const router = express.Router();

// Route to send a message
router.route('/send/:id').post(validateuser, sendMessage);

// Route to get all messages in a conversation
router.route('/all/:id').get(validateuser, getMessage);
export default router;