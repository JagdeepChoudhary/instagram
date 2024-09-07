import Home from "./components/home";
import Login from "./components/login";
import MainLayout from "./components/mainLayout";
import Profile from "./components/profile";
import Signup from "./components/signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./reduxStore/chatSlice";
import { setSocket } from "./reduxStore/socketSlice";
import { setLikeNotification } from "./reduxStore/rtnSlice";
import ProctedRoutes from "./components/ProctedRoutes";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProctedRoutes>
        <MainLayout />
      </ProctedRoutes>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/editprofile",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: (
          <ProctedRoutes>
            <ChatPage />,
          </ProctedRoutes>
        ),
      },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      // Listen for online users
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // Listen for notification
      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      // Clean up the socket on unmount or logout
      return () => {
        socketio.disconnect(); // Ensure socket is disconnected
        dispatch(setSocket(null)); // Reset the socket in redux
      };
    }
  }, [user, dispatch]); // Removed `socket` from dependency list

  return <RouterProvider router={browserRouter} />;
}

export default App;
