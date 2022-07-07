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
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import EditIcon from "@mui/icons-material/Edit";
import ImageList from "@mui/material/ImageList";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";

import Image from "material-ui-image";

import { getAllCategories } from "../../api/category";
import {
  updateService,
  getServiceById,
  getServicePicturePaths,
} from "../../api/service";
import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";

import { handlePictureUpload, handlePictureDelete } from "../../api/picture";

import { useParams } from "react-router";
import { useTranslation } from 'react-i18next';

export const EditService = (props) => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const navigate = useNavigate();
  const { id } = useParams(); // query param from url
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]); // dropdown options
  const [uploadedPictures, setUploadedPictures] = useState();

  const [deletedPictures, setDeletedPictures] = useState([]);
  const [additionalPictures, setAdditionalPictures] = useState([]); // to be uploaded during edit

  // paths are fetched after rendering is done so they must be awaited
  const [picturesLoaded, setPicturesLoaded] = useState(false);

  const [inputValues, setInputValues] = useState({
    title: { value: "", error: false, errorMsg: "" },
    description: { value: "", error: false, errorMsg: "" },
    category: { value: "", error: false, errorMsg: "" },
    price: { value: "", error: false, errorMsg: "" },
  });

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

    if (!userRoles.includes("Moderator") && !userRoles.includes("Admin")) {
      navigate("/home");
      return;
    }

    // get available categories
    getAllCategories().then((res) => {
      let categories = [];

      res?.data?.payload.forEach((category) => categories.push(category));
      setCategories([...categories]);
    });

    // get all pictures that correspond to this service
    getServicePicturePaths(id).then((res) => {
      if (res.data?.status === "success") {
        let paths = [];

        res?.data?.payload.forEach((path) => paths.push(path.picture_path));
        setUploadedPictures([...paths]);
        setPicturesLoaded(true);
      }
    });

    // prepopulate edit form
    getServiceById(id).then((res) => {
      if (res.data?.status === "failed") {
        navigate(`/services/show/${id}`);
        return;
      }

      const service = res.data?.payload[0];
      let updatedState = { ...inputValues };

      updatedState.title = {
        value: service.service_title,
        error: inputValues.title.error,
        errorMsg: inputValues.title.errorMsg,
      };

      updatedState.description = {
        value: service.service_description,
        error: inputValues.description.error,
        errorMsg: inputValues.description.errorMsg,
      };

      updatedState.price = {
        value: service.service_price,
        error: inputValues.price.error,
        errorMsg: inputValues.price.errorMsg,
      };

      updatedState.category = {
        value: service.category_id,
        error: inputValues.category.error,
        errorMsg: inputValues.category.errorMsg,
      };

      setInputValues(updatedState);
    });
  }, []);

  const processServiceEditForm = () => {
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
        errorMsg: "Price field cannot be empty.",
      };

    if (!inputValues?.category?.value) {
      updatedState.category = {
        value: updatedState.category.value,
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

    if (inputValues?.category?.value)
      updatedState.category = {
        value: updatedState.category.value,
        error: false,
        errorMsg: "",
      };

    if (
      inputValues?.title?.value &&
      inputValues?.description?.value &&
      inputValues?.category?.value &&
      inputValues?.price?.value &&
      validatePrice(inputValues.price.value)
    ) {
      // remove any pictures if needed
      if (deletedPictures.length !== 0) {
        for (let i = 0; i < deletedPictures.length; i++)
          handlePictureDelete("service", id, deletedPictures[i]);
      }

      // add more pictures if needed
      if (additionalPictures.length !== 0)
        handlePictureUpload("service", id, additionalPictures);

      // update main fields
      updateService(
        id,
        inputValues.title.value,
        inputValues.description.value,
        inputValues.price.value,
        inputValues.category.value
      ).then((res) => {
        if (res.data?.status === "success")
          navigate(`/services/show/${id}`, {
            state: { success: "true", message: "Update successful." },
          });
        else
          navigate(`/services/show/${id}`, {
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
            {t("Edit service")}
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              name="title"
              type="text"
              placeholder="Service name"
              label={t("Service name")}
              margin="normal"
              fullWidth
              value={
                inputValues["title"]?.value ? inputValues["title"].value : ""
              }
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
              margin="normal"
              multiline
              rows={3}
              maxRows={5}
              value={
                inputValues["description"]?.value
                  ? inputValues["description"].value
                  : ""
              }
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
              margin="normal"
              fullWidth
              value={
                inputValues["price"]?.value ? inputValues["price"].value : ""
              }
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
                inputValues["category"]?.error
                  ? inputValues["category"].error
                  : false
              }
              helperText={
                inputValues["category"]?.errorMsg
                  ? t(inputValues["category"].errorMsg)
                  : ""
              }
              fullWidth
              margin="normal"
            >
              <InputLabel id="demo-simple-select-label">{t("Category")}</InputLabel>
              <Select
                label="Category"
                value={
                  inputValues["category"]?.value
                    ? inputValues["category"].value
                    : ""
                }
                onChange={(e) => {
                  setInputValues((prevInputValues) => ({
                    ...prevInputValues,
                    category: {
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
              onChange={(e) => setAdditionalPictures(e.target.files)}
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
            {picturesLoaded && (
              <ImageList
                sx={{ width: 450, height: 150 }}
                cols={3}
                rowHeight={164}
              >
                {uploadedPictures.map((path) => (
                  <Image
                    src={`${path}?w=164&h=164&fit=crop&auto=format`}
                    onClick={(e) => {
                      // prepare for deletion, remove from the displayed ones
                      const path = e.target.currentSrc.split("?")[0];
                      setDeletedPictures([
                        ...uploadedPictures.filter((p) => p === path),
                      ]);
                      setUploadedPictures([
                        ...uploadedPictures.filter((p) => p !== path),
                      ]);
                    }}
                  />
                ))}
              </ImageList>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => processServiceEditForm()}
            >
              {t("Edit service")}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
