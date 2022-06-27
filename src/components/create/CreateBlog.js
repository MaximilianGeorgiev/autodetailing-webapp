import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validatePrice } from "../../utils/validator";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";

import { createBlog } from "../../api/blog";
import { handlePictureUpload } from "../../api/picture";
import { useTranslation } from 'react-i18next';

import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";

export const CreateBlog = () => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [inputValues, setInputValues] = useState({
    title: { value: "", error: false, errorMsg: "" },
    text: { value: "", error: false, errorMsg: "" },
  });

  const [uploadedPictures, setUploadedPictures] = useState();

  useEffect(() => {
    // don't allow non logged in users to access this page
    const hasCookies = clientHasLoginCookies();
    if (!hasCookies) navigate("/", { state: { "event": "loggedOut" } });

    // don't permit non moderator and non admin users to access this page (redirect)
    const userRoles = getCookieByName("user_roles");


    if (!userRoles.includes("Moderator") && !userRoles.includes("Admin")) {
      navigate("/", { state: { "event": "loggedIn" } });
      return;
    }
  }, []);

  const processBlogCreationForm = () => {
    let updatedState = { ...inputValues };

    if (!inputValues?.title?.value)
      updatedState.title = {
        value: updatedState.title.value,
        error: true,
        errorMsg: "Article title cannot be empty.",
      };

    if (!inputValues?.text?.value)
      updatedState.text = {
        value: updatedState.text.value,
        error: true,
        errorMsg: "Article text cannot be empty.",
      };

    // case: subsequent error requests but one of the fields is corrected
    if (inputValues?.title?.value)
      updatedState.title = {
        value: updatedState.title.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.text?.value)
      updatedState.text = {
        value: updatedState.text.value,
        error: false,
        errorMsg: "",
      };

    if (
      inputValues?.title?.value &&
      inputValues?.text?.value &&
      uploadedPictures !== null &&
      uploadedPictures.length !== 0
    ) {
      createBlog(
        inputValues.title.value,
        inputValues.text.value,
      ).then((res) => {
        const blogId = res.data?.blog?.blog_id;

        // Upload pictures to the server
        const uploadSuccess = handlePictureUpload("blog", blogId, uploadedPictures);

        if (uploadSuccess) navigate("/", {
          state: { success: "true", message: "Article created successfully." },
        });

        else {
          // display errors
        }
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
            <AddBoxIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("Create article")}
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              name="title"
              type="text"
              placeholder="Title"
              label={t("Title")}
              margin="normal"
              fullWidth
              error={
                inputValues["title"]?.error ? inputValues["title"].error : false
              }
              helperText={
                inputValues["title"]?.errorMsg
                  ? t(inputValues["title"].errorMsg)
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  title: {
                    value: e.target.value,
                  },
                }));
              }}
            />
            <TextField
              name="text"
              type="text"
              placeholder="Text"
              label="Text"
              fullWidth
              multiline
              rows={3}
              maxRows={5}
              margin="normal"
              error={
                inputValues["text"]?.error
                  ? inputValues["text"].error
                  : false
              }
              helperText={
                inputValues["text"]?.errorMsg
                  ? t(inputValues["text"].errorMsg)
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  text: {
                    value: e.target.value,
                  },
                }));
              }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={(e) => {
                setUploadedPictures(e.target.files)
              }}
            />
            <label htmlFor="raised-button-file">
            <Button
                variant="outlined"
                fullWidth
                component="span"
                startIcon={<PhotoCameraBackIcon />}
              >
                {t("Upload pictures")}
              </Button>
            </label>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => processBlogCreationForm()}
            >
              {t("Create article")}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
