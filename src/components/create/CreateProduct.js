import { useState, useEffect } from "react";

import { useCookies } from "react-cookie";

import { login } from "../../api/user";
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
import FormControl from "@mui/material/FormControl";

import { getAllCategories } from "../../api/category";
import { createProduct } from "../../api/product";
import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";

export const CreateProduct = () => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]); // dropdown options

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
          {category.category_name}
        </MenuItem>
      );

    return menuItems;
  };

  useEffect(() => {
    // don't allow non logged in users to access this page
    const hasCookies = clientHasLoginCookies();
    if (!hasCookies) navigate("/", {state: {"event": "loggedOut"}});

    // don't permit non moderator and non admin users to access this page (redirect)
    const userRoles = getCookieByName("user_roles");
    if (!userRoles.includes("Moderator") && !userRoles.includes("Admin")) {
      navigate("/", {state: {"event": "loggedIn"}});
      return;
    }
    // get available categories
    getAllCategories().then((res) => {
      let categories = [];

      res?.data?.payload.forEach((category) => categories.push(category));
      setCategories([...categories]);
    });
  }, []);

  const processProductCreationForm = () => {
    let updatedState = { ...inputValues };

    if (!inputValues?.title?.value)
      updatedState.title = {
        value: updatedState.title.value,
        error: true,
        errorMsg: "Product name field cannot be empty.",
      };

    if (!inputValues?.description?.value)
      updatedState.description = {
        value: updatedState.description.value,
        error: true,
        errorMsg: "Product description field cannot be empty.",
      };

    if (!inputValues?.price?.value)
      updatedState.price = {
        value: updatedState.price.value,
        error: true,
        errorMsg: "Price field cannot be empty.",
      };

    if (!inputValues?.selectedCategory?.value) {
      updatedState.selectedCategory = {
        value: updatedState.description.value,
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

    if (inputValues?.selectedCategory?.value)
      updatedState.selectedCategory = {
        value: updatedState.selectedCategory.value,
        error: false,
        errorMsg: "",
      };

    if (
      inputValues?.title?.value &&
      inputValues?.description?.value &&
      inputValues?.selectedCategory?.value &&
      validatePrice(inputValues.price.value)
    ) {
      createProduct(
        inputValues.title.value,
        inputValues.description.value,
        inputValues.price.value,
        inputValues.selectedCategory.value
      ).then((res) => {
        navigate("/", {
          state: { success: "true", message: "Product created successfully." },
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
            <AddBoxIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create a product
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              name="title"
              type="text"
              placeholder="Product name"
              label="Product name"
              margin="normal"
              fullWidth
              error={
                inputValues["title"]?.error ? inputValues["title"].error : false
              }
              helperText={
                inputValues["title"]?.errorMsg
                  ? inputValues["title"].errorMsg
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
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              maxRows={5}
              error={
                inputValues["description"]?.error
                  ? inputValues["description"].error
                  : false
              }
              helperText={
                inputValues["description"]?.errorMsg
                  ? inputValues["description"].errorMsg
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
              label="Price"
              margin="normal"
              fullWidth
              error={
                inputValues["price"]?.error ? inputValues["price"].error : false
              }
              helperText={
                inputValues["price"]?.errorMsg
                  ? inputValues["price"].errorMsg
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
                  ? inputValues["selectedCategory"].errorMsg
                  : ""
              }
              fullWidth
              margin="normal"
            >
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => processProductCreationForm()}
            >
              Create product
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
