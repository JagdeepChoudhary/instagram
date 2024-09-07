import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/reduxStore/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode, User2, ArrowLeft } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/reduxStore/chatSlice";
import { Link } from "react-router-dom";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const [showUserList, setShowUserList] = useState(true);
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) {
      console.log("Message is empty");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8000/api/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      } else {
        console.log("Failed to send message:", res.data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  const handleUserSelect = (user) => {
    dispatch(setSelectedUser(user));
    setShowUserList(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* User List Section */}
      <section
        className={`w-full md:w-1/3 lg:w-2/5 border-r border-gray-300 mt-10 md:mt-0 pl-[0%] md:pl-[16%] ${
          showUserList ? "block" : "hidden md:block"
        }`}
      >
        <div className="p-4 border-b border-gray-300">
          <h1 className="font-bold text-xl">{user?.username}</h1>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] pb-16 md:pb-0">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => handleUserSelect(suggestedUser)}
                className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
              >
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>
                    <User2 />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{suggestedUser?.username}</p>
                  <p
                    className={`text-xs ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      <section
        className={`flex-1 flex flex-col h-full ${
          !showUserList ? "block" : "hidden md:block"
        }`}
      >
        {selectedUser ? (
          <>
            <div className="flex items-center p-4 border-b border-gray-300 sticky top-0 bg-white z-10 ">
              <button
                onClick={() => setShowUserList(true)}
                className="md:hidden mr-4"
              >
                <ArrowLeft />
              </button>
              <Avatar className="w-10 h-10 mr-4">
                <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                <AvatarFallback>
                  <User2 />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{selectedUser?.username}</span>
              <Link to={`/profile/${selectedUser?._id}`} className="ml-auto">
                <Button variant="ghost" size="sm">
                  View profile
                </Button>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Messages selectedUser={selectedUser} />
            </div>
            <div className="flex items-center p-4 border-t border-gray-300 bg-white sticky bottom-8 md:relative md:bottom-0">
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                className="flex-1 mr-2 focus-visible:ring-transparent"
                placeholder="Message..."
              />
              <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageCircleCode className="w-24 h-24 mb-4 text-gray-400" />
            <h2 className="text-xl font-medium mb-2">Your Messages</h2>
            <p className="text-gray-500">
              Select a chat or start a new conversation
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatPage;
