import React, { useState } from "react";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  User2,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/reduxStore/authSlice.js";
import Createpost from "./Createpost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Leftsidebar = () => {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout was unsuccessful");
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
    setMobileMenuOpen(false);
  };

  const NotificationPopover = () => (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <Heart size={24} />
          {likeNotification.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {likeNotification.length}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          {likeNotification.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            likeNotification.map((notification) => (
              <div
                key={notification.userId}
                className="flex items-center gap-2 my-2"
              >
                <Avatar>
                  <AvatarImage src={notification.userDetails?.profilePicture} />
                  <AvatarFallback>
                    <User2 />
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm">
                  <span className="font-bold">
                    {notification.userDetails?.username}
                  </span>{" "}
                  liked your post
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );

  const sidebaritems = [
    { icon: <Home size={24} />, text: "Home" },
    { icon: <Search size={24} />, text: "Search" },
    { icon: <TrendingUp size={24} />, text: "Explore" },
    { icon: <MessageCircle size={24} />, text: "Messages" },
    {
      icon: <NotificationPopover />, // Use the defined NotificationPopover
      text: "Notifications",
    },
    { icon: <PlusSquare size={24} />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>
            <User2 className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut size={24} />, text: "Logout" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 z-10 px-4 border-r border-gray-200 w-[16%] h-screen bg-white">
        <div className="flex flex-col w-full">
          <h1 className="font-bold text-center py-6 text-xl">LOGO</h1>
          <div className="flex-grow">
            {sidebaritems.map((item, index) => (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-2"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10 px-4 py-2 flex justify-between items-center">
        <h1 className="font-bold text-xl">LOGO</h1>
        <div className="flex items-center space-x-4">
          <NotificationPopover />
          <MessageCircle size={24} onClick={() => sidebarHandler("Messages")} />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around items-center py-2">
          <Home size={24} onClick={() => sidebarHandler("Home")} />
          <Search size={24} onClick={() => sidebarHandler("Search")} />
          <PlusSquare size={24} onClick={() => sidebarHandler("Create")} />
          <TrendingUp size={24} onClick={() => sidebarHandler("Explore")} />
          <Avatar className="w-6 h-6" onClick={() => sidebarHandler("Profile")}>
            <AvatarImage src={user?.profilePicture} alt="@shadcn" />
            <AvatarFallback>
              <User2 className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Createpost open={open} setOpen={setOpen} />
    </>
  );
};

export default Leftsidebar;
