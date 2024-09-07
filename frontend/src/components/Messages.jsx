import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import { User2 } from "lucide-react";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetAllMessage();
  useGetRTM();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  // Early return if no selected user
  if (!selectedUser) {
    return <div className="flex-1 p-4">Select a user to start chatting.</div>;
  }

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>
              <User2 />
            </AvatarFallback>
          </Avatar>
          <span className="mt-2 text-lg font-semibold">
            {selectedUser?.username}
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 mt-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            return (
              <div
                key={msg._id}
                className={`flex ${
                  msg.senderId === user?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    msg.senderId === user?._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
