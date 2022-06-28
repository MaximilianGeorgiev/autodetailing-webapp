const getCookieByName = (name) => {
  if (!name) return "";

  try {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      .split("=")[1];
  } catch (err) {
    return "";
  }
};

const clientHasLoginCookies = () => {
  if (
    getCookieByName("user_id") !== "" &&
    getCookieByName("user_id") !== "undefined"
  )
    return true;
  if (
    getCookieByName("accessToken") !== "" &&
    getCookieByName("accessToken") !== "undefined"
  )
    return true;
  if (
    getCookieByName("refreshToken") !== "" &&
    getCookieByName("refreshToken") !== "undefined"
  )
    return true;
  if (
    getCookieByName("user_fullname") !== "" &&
    getCookieByName("user_fullname") !== "undefined"
  )
    return true;
  if (
    getCookieByName("user_phone") !== "" &&
    getCookieByName("user_phone") !== "undefined"
  )
    return true;
  if (
    getCookieByName("user_address") !== "" &&
    getCookieByName("user_address") !== "undefined"
  )
    return true;

  return false;
};

const setCookiess = (name, value) => {
  if (
    name !== "" &&
    name !== undefined &&
    (value !== "") & (value !== undefined)
  )
    document.cookie = `${name}=${value}`;
};

export { getCookieByName, clientHasLoginCookies, setCookiess };
