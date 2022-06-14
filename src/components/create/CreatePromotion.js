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
import FormControl from "@mui/material/FormControl";

import { getAllProducts } from "../../api/product";
import { getAllServices } from "../../api/service";
import { createPromotion } from "../../api/promotion";

import { getCookieByName } from "../../utils/cookies";
import { validateDates }  from "../../utils/validator";
import { clientHasLoginCookies } from "../../utils/cookies";

import { SelectableButtonGroup } from "../SelectableButtonGroup";

export const CreatePromotion = () => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const navigate = useNavigate();

  // a promotion can be created for either a product or a service
  // store the existing products needed for a dropdown
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  // product or service selected
  const [categoryToggle, setCategoryToggle] = useState(true);

  const [inputValues, setInputValues] = useState({
    dateFrom: { value: null, error: false, errorMsg: "" },
    dateTo: { value: null, error: false, errorMsg: "" },
    newPrice: { value: "", error: false, errorMsg: "" },
    selectedEntity: { value: "", error: false, errorMsg: "" },
  });

  const populateProductDropDown = () => {
    let menuItems = [];

    for (const product of products)
      menuItems.push(
        <MenuItem value={product.product_id}>{product.product_title}</MenuItem>
      );

    return menuItems;
  };

  const populateServiceDropDown = () => {
    let menuItems = [];

    for (const service of services)
      menuItems.push(
        <MenuItem value={service.service_id}>{service.service_title}</MenuItem>
      );

    return menuItems;
  };

  useEffect(() => {
    // don't allow non logged in users to access this page
    const hasCookies = clientHasLoginCookies();
    if (hasCookies) navigate("/");

    // don't permit non moderator and non admin users to access this page (redirect)
    const userRoles = getCookieByName("user_roles");
    if (!userRoles.includes("Moderator") && !userRoles.includes("Admin")) {
      navigate("/");
      return;
    }

    // get available categories
    getAllProducts().then((res) => {
      let products = [];

      res?.data?.payload.forEach((product) => products.push(product));
      setProducts([...products]);
    });

    getAllServices().then((res) => {
      let services = [];

      res?.data?.payload.forEach((service) => services.push(service));
      setServices([...services]);
    });
  }, []);

  const processPromotionCreationForm = () => {
    let updatedState = { ...inputValues };

    if (!inputValues?.dateFrom?.value)
      updatedState.dateFrom = {
        value: updatedState.dateFrom.value,
        error: true,
        errorMsg: "Starting date cannot be empty.",
      };

    if (!inputValues?.dateTo?.value)
      updatedState.dateTo = {
        value: updatedState.dateTo.value,
        error: true,
        errorMsg: "Ending date cannot be empty.",
      };

    if (!inputValues?.newPrice?.value)
      updatedState.newPrice = {
        value: updatedState.newPrice.value,
        error: true,
        errorMsg: "Price field cannot be empty.",
      };

    if (!inputValues?.selectedEntity?.value)
      updatedState.selectedEntity = {
        value: updatedState.selectedEntity.value,
        error: true,
        errorMsg: `No ${categoryToggle ? "product" : "service"} selected.`,
      };

    // case: subsequent error requests but one of the fields is corrected
    if (inputValues?.dateFrom?.value)
      updatedState.dateFrom = {
        value: updatedState.dateFrom.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.dateTo?.value)
      updatedState.dateTo = {
        value: updatedState.dateTo.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.selectedEntity?.value)
      updatedState.selectedEntity = {
        value: updatedState.selectedEntity.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.newPrice?.value) {
      if (validatePrice(inputValues.newPrice.value)) {
        updatedState.newPrice = {
          value: updatedState.newPrice.value,
          error: false,
          errorMsg: "",
        };
      } else {
        updatedState.newPrice = {
          value: updatedState.newPrice.value,
          error: true,
          errorMsg: "Price is not valid.",
        };
      }
    }

    if (inputValues.dateFrom.value && inputValues.dateTo.value) {
      if (validateDates(inputValues.dateFrom.value, inputValues.dateTo.value)) {
        updatedState.dateFrom = {
          value: updatedState.dateFrom.value,
          error: false,
          errorMsg: "",
        };
      } else {
        updatedState.dateFrom = {
          value: updatedState.dateFrom.value,
          error: true,
          errorMsg:
            "Starting date cannot be after end date or the dates are invalid.",
        };
      }
    }

    if (
      inputValues?.dateFrom?.value &&
      inputValues?.dateTo?.value &&
      inputValues?.selectedEntity?.value &&
      validatePrice(inputValues.newPrice.value) &&
      validateDates(inputValues.dateFrom.value, inputValues.dateTo.value)
    ) {
      createPromotion(
        inputValues.dateFrom.value,
        inputValues.dateTo.value,
        inputValues.newPrice.value,
        inputValues.selectedEntity.value,
        categoryToggle ? "product" : "service"
      ).then((res) => {
        navigate("/", { state: { "success": "true", "message": "Promotion created successfully." } });
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
            Create promotion
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <SelectableButtonGroup
              firstOption="Products"
              secondOption="Services"
              margin="normal"
              toggleSelect={setCategoryToggle}
            />
            <TextField
              id="date"
              label="Date from"
              type="date"
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={inputValues["dateFrom"].value}
              error={
                inputValues["dateFrom"]?.error
                  ? inputValues["dateFrom"].error
                  : false
              }
              helperText={
                inputValues["dateFrom"]?.errorMsg
                  ? inputValues["dateFrom"].errorMsg
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  dateFrom: {
                    value: e.target.value,
                  },
                }));
              }}
            />
            <TextField
              id="date"
              label="Date to"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={inputValues["dateTo"].value}
              error={
                inputValues["dateTo"]?.error
                  ? inputValues["dateTo"].error
                  : false
              }
              helperText={
                inputValues["dateTo"]?.errorMsg
                  ? inputValues["dateTo"].errorMsg
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  dateTo: {
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
              fullWidth
              margin="normal"
              error={
                inputValues["newPrice"]?.error
                  ? inputValues["newPrice"].error
                  : false
              }
              helperText={
                inputValues["newPrice"]?.errorMsg
                  ? inputValues["newPrice"].errorMsg
                  : ""
              }
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  newPrice: {
                    value: e.target.value,
                  },
                }));
              }}
            />
            <FormControl
              error={
                inputValues["selectedEntity"]?.error
                  ? inputValues["selectedEntity"].error
                  : false
              }
              helperText={
                inputValues["selectedEntity"]?.errorMsg
                  ? inputValues["selectedEntity"].errorMsg
                  : ""
              }
              fullWidth
              margin="normal"
            >
              <InputLabel id="demo-simple-select-label">
                {categoryToggle ? "Product" : "Service"}
              </InputLabel>
              <Select
                label={categoryToggle ? "Product" : "Service"}
                onChange={(e) => {
                  setInputValues((prevInputValues) => ({
                    ...prevInputValues,
                    selectedEntity: {
                      value: e.target.value,
                    },
                  }));
                }}
              >
                {categoryToggle
                  ? populateProductDropDown()
                  : populateServiceDropDown()}
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => processPromotionCreationForm()}
            >
              Create promotion
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
