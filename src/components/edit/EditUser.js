import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { validatePhone, validatePrice } from "../../utils/validator";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

import { getUserById, updateUser } from "../../api/user";
import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";

import { useParams } from "react-router";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";

export const EditUser = (props) => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const navigate = useNavigate();
  const { id } = useParams(); // query param from url
  const { t } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies(['']);

  const [inputValues, setInputValues] = useState({
    email: { value: "", error: false, errorMsg: "" },
    password: { value: null, error: false, errorMsg: "" },
    newPassword: { value: "", error: false, errorMsg: "" },
    fullname: { value: "", error: false, errorMsg: "" },
    phone: { value: "", error: false, errorMsg: "" },
    address: { value: "", error: false, errorMsg: "" },
  });

  useEffect(() => {
    // don't allow non logged in users to access this page
    const hasCookies = clientHasLoginCookies();
    if (!hasCookies) navigate("/", { state: { event: "loggedOut" } });

    // Only the logged in user can edit their own profile, or an administrator/moderator
    const userRoles = getCookieByName("user_roles");
    const userId = getCookieByName("user_id");

    if (
      userId !== id &&
      !userRoles.includes("Moderator") &&
      !userRoles.includes("Admin")
    ) {
      navigate("/", { state: { event: "loggedIn" } });
      return;
    }

    // prepopulate edit form
    // a promotion can be either for a product or a service
    getUserById(id).then((res) => {
      if (res.data?.status === "failed") {
        userId === id ? navigate('/') : navigate('/users/show/all');
        return;
      }

      const user = res.data?.payload[0];
      let updatedState = { ...inputValues };

      updatedState.email = {
        value: user.user_email,
        error: inputValues.email.error,
        errorMsg: inputValues.email.errorMsg,
      };

      updatedState.fullname = {
        value: user.user_fullname,
        error: inputValues.fullname.error,
        errorMsg: inputValues.fullname.errorMsg,
      };

      updatedState.address = {
        value: user.user_address,
        error: inputValues.address.error,
        errorMsg: inputValues.address.errorMsg,
      };

      updatedState.phone = {
        value: user.user_phone,
        error: inputValues.phone.error,
        errorMsg: inputValues.phone.errorMsg,
      };

      setInputValues(updatedState);
    });
  }, []);

  const processUserEditForm = () => {
    let updatedState = { ...inputValues };

    if (!inputValues?.email?.value)
      updatedState.email = {
        value: updatedState.email.value,
        error: true,
        errorMsg: "E-mail cannot be empty.",
      };

    if (!inputValues?.fullname?.value)
      updatedState.fullname = {
        value: updatedState.fullname.value,
        error: true,
        errorMsg: "Full name cannot be empty.",
      };

    // case: subsequent error requests but one of the fields is corrected
    if (inputValues?.email?.value)
      updatedState.email = {
        value: updatedState.email.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.fullname?.value)
      updatedState.fullname = {
        value: updatedState.fullname.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.phone?.value && validatePhone(inputValues.phone.value)) {
      updatedState.phone = {
        value: updatedState.phone.value,
        error: false,
        errorMsg: "",
      };
    } else if (
      inputValues?.phone?.value &&
      !validatePhone(inputValues.phone.value)
    ) {
      updatedState.phone = {
        vaue: updatedState.phone.value,
        error: true,
        errorMsg: "Provided phone number is invalid.",
      };
    } else if (!inputValues?.phone?.value) {
      updatedState.phone = {
        value: updatedState.phone.value,
        error: false,
        errorMsg: "",
      };
    }

    if (inputValues?.email?.value && inputValues?.fullname?.value) {
      let updateData = {
        user_email: inputValues.email.value,
        user_fullname: inputValues.fullname.value,
      };

      if (inputValues?.phone.value && validatePhone(inputValues.phone.value))
        updateData = { ...updateData, user_phone: inputValues.phone.value };

      if (inputValues?.phone.value && !validatePhone(inputValues.phone.value))
        return;

      if (inputValues?.address.value)
        updateData = { ...updateData, user_address: inputValues.address.value };

      const payload = { updateData: updateData };

      updateUser(id, payload).then((res) => {
        if (res.data?.status === "success") {
          // navigate to main page if the user is the one editing their own profile
          const userId = getCookieByName("user_id");

          if (userId === id) {
            setCookie("user_fullname", res.data.user[0].user_fullname);
            setCookie("user_username", res.data.user[0].user_username);
            setCookie("user_id", res.data.user[0].user_id);
            setCookie(
              "user_phone",
              res.data.user[0].user_phone ? res.data.user[0].user_phone : ""
            );
            setCookie(
              "user_address",
              res.data.user[0].user_address ? res.data.user[0].user_address : ""
            );

            navigate("/", {
              state: { success: "true", message: "Update successful." },
            });
          } else {
            // navigate to admin page for users if the user is admin/moderator
            navigate('/users/show/all', {
              state: { success: "true", message: "Update successful." },
            });
          }
        } else
          navigate('/users/show/all', {
            state: { success: "false", message: "Update failed." },
          });
      });
    }

    setInputValues(updatedState);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <EditIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("Edit user")}
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              id="email"
              label={t("E-mail")}
              type="email"
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={inputValues["email"].value}
              error={
                inputValues["email"]?.error ? inputValues["email"].error : false
              }
              helperText={
                inputValues["email"]?.errorMsg
                  ? t(inputValues["email"].errorMsg)
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  email: {
                    value: e.target.value,
                  },
                }));
              }}
            />
            <TextField
              id="fullname"
              label={t("Full name")}
              type="email"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={inputValues["fullname"].value}
              error={
                inputValues["fullname"]?.error
                  ? inputValues["fullname"].error
                  : false
              }
              helperText={
                inputValues["fullname"]?.errorMsg
                  ? t(inputValues["fullname"].errorMsg)
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  fullname: {
                    value: e.target.value,
                  },
                }));
              }}
            />
            <TextField
              name="phone"
              type="text"
              placeholder="Phone number"
              label={t("Phone number")}
              fullWidth
              margin="normal"
              value={
                inputValues["phone"]?.value ? inputValues["phone"].value : ""
              }
              error={
                inputValues["phone"]?.error ? inputValues["phone"].error : false
              }
              helperText={
                inputValues["phone"]?.errorMsg
                  ? t(inputValues["phone"].errorMsg)
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  phone: {
                    value: e.target.value,
                  },
                }));
              }}
            />
            <TextField
              name="phone"
              type="text"
              placeholder="Address"
              label={t("Address")}
              fullWidth
              margin="normal"
              value={
                inputValues["address"]?.value
                  ? inputValues["address"].value
                  : ""
              }
              error={
                inputValues["address"]?.error
                  ? inputValues["address"].error
                  : false
              }
              helperText={
                inputValues["address"]?.errorMsg
                  ? t(inputValues["address"].errorMsg)
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  address: {
                    value: e.target.value,
                  },
                }));
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => processUserEditForm()}
            >
              {t("Edit user")}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
