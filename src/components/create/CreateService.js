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
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import FormControl from "@mui/material/FormControl";

import { getAllCategories } from "../../api/category";
import { createService } from "../../api/service";
import { handlePictureUpload } from "../../api/picture";
import { useTranslation } from 'react-i18next';

import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";

export const CreateService = () => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]); // dropdown options

  const [inputValues, setInputValues] = useState({
    title: { value: "", error: false, errorMsg: "" },
    description: { value: "", error: false, errorMsg: "" },
    selectedCategory: { value: "", error: false, errorMsg: "" },
    price: { value: "", error: false, errorMsg: "" },
  });

  const [uploadedPictures, setUploadedPictures] = useState();

  const populateDropDown = () => {
    let menuItems = [];

    for (const category of categories)
      menuItems.push(
        <MenuItem value={category.category_id}>
          {t(category.category_name)}
        </MenuItem>
      );

    return menuItems;
  };

  useEffect(() => {
    // don't allow non logged in users to access this page
    const hasCookies = clientHasLoginCookies();
    if (!hasCookies) navigate("/home");

    // don't permit non moderator and non admin users to access this page (redirect)
    const userRoles = getCookieByName("user_roles");
    console.log("service" + userRoles);

    if (!userRoles.includes("Admin")) {
      navigate("/home");
      return;
    }

    // get available categories
    getAllCategories().then((res) => {
      let categories = [];

      res?.data?.payload.forEach((category) => categories.push(category));
      setCategories([...categories]);
    });
  }, []);

  const processServiceCreationForm = () => {
    let updatedState = { ...inputValues };

    if (!inputValues?.title?.value)
      updatedState.title = {
        value: updatedState.title.value,
        error: true,
        errorMsg: "Service name field cannot be empty.",
      };

    if (!inputValues?.description?.value)
      updatedState.description = {
        value: updatedState.description.value,
        error: true,
        errorMsg: "Service description field cannot be empty.",
      };

    if (!inputValues?.price?.value)
      updatedState.price = {
        value: updatedState.price.value,
        error: true,
        errorMsg: "Service price field cannot be empty.",
      };

    if (!inputValues?.selectedCategory?.value) {
      updatedState.selectedCategory = {
        value: updatedState.selectedCategory.value,
        error: true,
        errorMsg: "There is no category selected.",
      };
    }

    // case: subsequent error requests but one of the fields is corrected
    if (inputValues?.title?.value)
      updatedState.title = {
        value: updatedState.title.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.description?.value)
      updatedState.description = {
        value: updatedState.description.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.selectedCategory?.value)
      updatedState.selectedCategory = {
        value: updatedState.selectedCategory.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.price?.value) {
      if (validatePrice(inputValues.price.value)) {
        updatedState.price = {
          value: updatedState.price.value,
          error: false,
          errorMsg: "",
        };
      } else {
        updatedState.price = {
          value: updatedState.price.value,
          error: true,
          errorMsg: "Price is not valid.",
        };
      }
    }

    if (
      inputValues?.title?.value &&
      inputValues?.description?.value &&
      inputValues?.selectedCategory?.value &&
      uploadedPictures !== null &&
      uploadedPictures.length !== 0 &&
      validatePrice(inputValues.price.value)
    ) {
      createService(
        inputValues.title.value,
        inputValues.description.value,
        inputValues.price.value,
        inputValues.selectedCategory.value
      ).then((res) => {
        const serviceId = res.data?.service?.service_id;

        // Upload pictures to the server
        const uploadSuccess = handlePictureUpload(
          "service",
          serviceId,
          uploadedPictures
        );

        if (uploadSuccess) {
          // otherwise navigation happens before files are physically uploaded.
          setTimeout(() => {
            navigate(`/services/show/${serviceId}`, {
              state: {
                success: "true",
                message: "Service created successfully.",
              },
            });
          }, 150);
        }
          
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
            {t("Create service")}
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              name="title"
              type="text"
              placeholder="Service name"
              label={(t("Service name"))}
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
              name="description"
              type="text"
              placeholder="Description"
              label={t("Description")}
              fullWidth
              multiline
              rows={3}
              maxRows={5}
              margin="normal"
              error={
                inputValues["description"]?.error
                  ? inputValues["description"].error
                  : false
              }
              helperText={
                inputValues["description"]?.errorMsg
                  ? t(inputValues["description"].errorMsg)
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  description: {
                    value: e.target.value,
                  },
                }));
              }}
            />
            <TextField
              name="price"
              type="text"
              placeholder="Price"
              label={t("Price")}
              fullWidth
              margin="normal"
              error={
                inputValues["price"]?.error ? inputValues["price"].error : false
              }
              helperText={
                inputValues["price"]?.errorMsg
                  ? t(inputValues["price"].errorMsg)
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  price: {
                    value: e.target.value,
                  },
                }));
              }}
            />
            <FormControl
              error={
                inputValues["selectedCategory"]?.error
                  ? inputValues["selectedCategory"].error
                  : false
              }
              helperText={
                inputValues["selectedCategory"]?.errorMsg
                  ? t(inputValues["selectedCategory"].errorMsg)
                  : ""
              }
              fullWidth
              margin="normal"
            >
              <InputLabel id="demo-simple-select-label">{t("Category")}</InputLabel>
              <Select
                label="Category"
                onChange={(e) => {
                  setInputValues((prevInputValues) => ({
                    ...prevInputValues,
                    selectedCategory: {
                      value: e.target.value,
                    },
                  }));
                }}
              >
                {populateDropDown()}
              </Select>
            </FormControl>

            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={(e) => {
                setUploadedPictures(e.target.files);
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
              onClick={() => processServiceCreationForm()}
            >
              {t("Create service")}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
