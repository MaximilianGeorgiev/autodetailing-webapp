import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Logout = (props) => {
  const [cookies, removeCookie] = useCookies([""]);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies["user_id"] !== undefined) removeCookie("user_id");
    if (cookies["user_fullname"]) removeCookie("user_fullname");
    if (cookies["user_username"]) removeCookie("user_username");
    if (cookies["user_phone"]) removeCookie("user_phone");
    if (cookies["user_address"]) removeCookie("user_address");
    if (cookies["user_roles"]) removeCookie("user_roles");

    if (cookies["accessToken"]) removeCookie("accessToken");
    if (cookies["refreshToken"]) removeCookie("refreshToken");

    navigate("/");
  }, []);
};
