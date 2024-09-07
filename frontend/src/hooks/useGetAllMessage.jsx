import { setMessages } from "@/reduxStore/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!selectedUser?._id) return; // Early return if no selected user

    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/all/${selectedUser._id}`,
          { withCredentials: true }
        );
        console.log(res);
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        } else {
          console.log("Failed to fetch messages:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchAllMessages();
  }, [dispatch, selectedUser]);
};

export default useGetAllMessage;
