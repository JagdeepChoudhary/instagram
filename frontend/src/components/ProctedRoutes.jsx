import store from "@/reduxStore/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProctedRoutes = ({ children }) => {
  const naqvigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (!user) {
      naqvigate("/login");
    }
  }, []);
  return <>{children}</>;
};

export default ProctedRoutes;
