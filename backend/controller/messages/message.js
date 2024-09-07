import { Conversation } from "../../models/conversation.js";
import { Message } from "../../models/message.js";
import { getReciverSocketId, io } from "../../Socket/Socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id
        const reciverId = req.params.id;
        const { textMessage: message } = req.body;  // Adjusting destructuring

        // Check if message is provided
        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Find or create conversation between participants
        let conversation = await Conversation.findOne({ participants: { $all: [senderId, reciverId] } });
        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, reciverId] });
        }

        // Create new message
        const newMessage = await Message.create({ senderId, reciverId, message });

        // Add message to the conversation and save both
        if (newMessage) {
            conversation.messages.push(newMessage._id);
            await Promise.all([newMessage.save(), conversation.save()]);
        }

        // Get receiver's socket ID and emit the message if online
        const reciverSocketId = getReciverSocketId(reciverId);
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json({ success: true, newMessage });
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// export const sendMessage = async (req, res) => {
//     try {
//         const senderId = req.user.id;
//         const receiverId = req.params.id;
//         const { textMessage: message } = req.body;
//         console.log(senderId, receiverId)
//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] }
//         });
//         // establish the conversation if not started yet.
//         if (!conversation) {
//             conversation = await Conversation.create({
//                 participants: [senderId, receiverId]
//             })
//         };
//         const newMessage = await Message.create({
//             senderId,
//             receiverId,
//             message
//         });
//         if (newMessage) conversation.messages.push(newMessage._id);

//         await Promise.all([conversation.save(), newMessage.save()])

//         // implement socket io for real time data transfer
//         const receiverSocketId = getReciverSocketId(receiverId);
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit('newMessage', newMessage);
//         }

//         return res.status(201).json({
//             success: true,
//             newMessage
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }
// export const getMessage = async (req, res) => {
//     try {
//         const senderId = req.id;
//         const receiverId = req.params.id;
//         const conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] }
//         }).populate('messages');
//         if (!conversation) return res.status(200).json({ success: true, messages: [] });

//         return res.status(200).json({ success: true, messages: conversation?.messages });

//     } catch (error) {
//         console.log(error);
//     }
// }

export const getMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');
        if (!conversation) return res.status(200).json({ success: true, messages: [] });

        return res.status(200).json({ success: true, messages: conversation?.messages });

    } catch (error) {
        console.log(error);
    }
}