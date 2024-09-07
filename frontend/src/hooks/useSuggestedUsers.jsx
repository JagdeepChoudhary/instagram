import { setSuggestedUsers } from "@/reduxStore/authSlice.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUser = async () => {
      try {
        const res = await axios.get(
          // "https://vgc1848d-8000.inc1.devtunnels.ms/api/getpost",
          "http://localhost:8000/api/suggestuser",
          {
            headers: {
              "Content-Type": "aplication/json",
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          //   console.log(res.data.posts);
          dispatch(setSuggestedUsers(res.data.user));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSuggestedUser();
  }, []);
};

export default useGetSuggestedUsers;
