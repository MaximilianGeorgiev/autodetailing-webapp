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
import EditIcon from "@mui/icons-material/Edit";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import { getAllServices } from "../../api/service";
import { getAllProducts } from "../../api/product";
import { getPromotionById, updatePromotion } from "../../api/promotion";
import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";

import { useParams } from "react-router";
import { useTranslation } from 'react-i18next';

export const EditPromotion = (props) => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams(); // query param from url

  const [entities, setEntities] = useState([]); // dropdown options
  const [entityType, setEntityType] = useState("");

  const [inputValues, setInputValues] = useState({
    dateFrom: { value: null, error: false, errorMsg: "" },
    dateTo: { value: null, error: false, errorMsg: "" },
    service: { value: "", error: false, errorMsg: "" },
    product: { value: "", error: false, errorMsg: "" },
    newPrice: { value: "", error: false, errorMsg: "" },
  });

  const populateDropDown = () => {
    let menuItems = [];

    if (entityType === "service") {
      for (const entity of entities)
        menuItems.push(<MenuItem value={entity.service_id}>{entity.service_title}</ MenuItem>);
    } else if (entityType === "product") {
      for (const entity of entities)
        menuItems.push(<MenuItem value={entity.product_id}>{entity.product_title}</ MenuItem>);
    }

    return menuItems;
  };

  useEffect(() => {
    // don't allow non logged in users to access this page
    const hasCookies = clientHasLoginCookies();
    if (!hasCookies) navigate("/");

    // don't permit non moderator and non admin users to access this page (redirect)
    const userRoles = getCookieByName("user_roles");

    if (!userRoles.includes("Moderator") && !userRoles.includes("Admin")) {
      navigate("/");
      return;
    }

    // prepopulate edit form
    // a promotion can be either for a product or a service
    getPromotionById(id).then((res) => {
      if (res.data?.status === "failed") {
        navigate(`/promotions/show/${id}`);
        return;
      }

      const promotion = res.data?.payload[0];
      let updatedState = { ...inputValues };

      updatedState.dateFrom = {
        value: promotion.promotion_from,
        error: inputValues.dateFrom.error,
        errorMsg: inputValues.dateFrom.errorMsg,
      };

      updatedState.dateTo = {
        value: promotion.promotion_to,
        error: inputValues.dateTo.error,
        errorMsg: inputValues.dateTo.errorMsg,
      };

      updatedState.newPrice = {
        value: promotion.promotion_new_price,
        error: inputValues.newPrice.error,
        errorMsg: inputValues.newPrice.errorMsg,
      };

      if (promotion.service_id) {
        setEntityType("service");

        updatedState.service = {
          value: promotion.service_id,
          error: inputValues.service.error,
          errorMsg: inputValues.service.errorMsg,
        };

        // get available services
        getAllServices().then((serviceRes) => {
          let services = [];

          serviceRes?.data?.payload.forEach((service) =>
            services.push(service)
          );
          setEntities([...services]);
        });
      } else if (promotion.product_id) {
        setEntityType("product");

        updatedState.product = {
          value: promotion.product_id,
          error: inputValues.product.error,
          errorMsg: inputValues.product.errorMsg,
        };

        // get available products
        getAllProducts().then((productRes) => {
          let products = [];

          productRes?.data?.payload.forEach((product) =>
            products.push(product)
          );
          setEntities([...products]);
        });
      }
      setInputValues(updatedState);
    });
  }, []);

  const processPromotionEditForm = () => {
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

    if (!inputValues?.service?.value && !inputValues?.product?.value) {
      updatedState.service = {
        value: updatedState.service.value,
        error: true,
        errorMsg: "There is no entity selected.",
      };

      updatedState.product = {
        value: updatedState.product.value,
        error: true,
        errorMsg: "There is no entity selected.",
      };
    }

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

    if (inputValues?.category?.value)
      updatedState.category = {
        value: updatedState.category.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.service?.value || inputValues?.product?.value) {
      updatedState.service = {
        value: updatedState.service.value,
        error: false,
        errorMsg: "",
      };

      updatedState.product = {
        value: updatedState.product.value,
        error: false,
        errorMsg: "",
      };
    }

    if (
      inputValues?.dateFrom?.value &&
      inputValues?.dateTo?.value &&
      inputValues?.newPrice?.value &&
      (inputValues?.service?.value || inputValues?.product?.value) &&
      validatePrice(inputValues.newPrice.value)
    ) {
      let entity = entityType === "service" ? "service" : "product";
      let entityValue = entityType === "service" ? inputValues.service.value : inputValues.product.value;
      updatePromotion(
        id,
        inputValues.dateFrom.value,
        inputValues.dateTo.value,
        inputValues.newPrice.value,
        entityValue,
        entity
      ).then((res) => {
        if (res.data?.status === "success")
          navigate(`/promotions/show/${id}`, {
            state: { success: "true", message: "Update successful." },
          });
        else
          navigate(`/promotions/show/${id}`, {
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
            {t("Edit promotion")}
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              id="date"
              label={t("Date from")}
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
                  ? t(inputValues["dateFrom"].errorMsg)
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
              label={t("Date to")}
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
                  ? t(inputValues["dateTo"].errorMsg)
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
              label={t("Price")}
              fullWidth
              margin="normal"
              value={
                inputValues["newPrice"]?.value
                  ? inputValues["newPrice"].value
                  : ""
              }
              error={
                inputValues["newPrice"]?.error
                  ? inputValues["newPrice"].error
                  : false
              }
              helperText={
                inputValues["newPrice"]?.errorMsg
                  ? t(inputValues["newPrice"].errorMsg)
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
                inputValues[entityType]?.error
                  ? inputValues[entityType].error
                  : false
              }
              helperText={
                inputValues[entityType]?.errorMsg
                  ? t(inputValues[entityType].errorMsg)
                  : ""
              }
              fullWidth
              margin="normal"
            >
              <InputLabel id="demo-simple-select-label">{entityType ? t(entityType[0].toUpperCase() + entityType.substring(1)) : "Entity"}</InputLabel>
              <Select
                label={entityType ? entityType[0].toUpperCase() + entityType.substring(1) : "Entity"}
                value={
                  inputValues[entityType]?.value
                    ? inputValues[entityType].value
                    : ""
                }
                onChange={(e) => {
                  if (entityType === "service") {
                    setInputValues((prevInputValues) => ({
                      ...prevInputValues,
                      service: {
                        value: e.target.value,
                      }
                    }));
                  } else if (entityType === "product") {
                    setInputValues((prevInputValues) => ({
                      ...prevInputValues,
                      product: {
                        value: e.target.value,
                      }
                    }));
                  }
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
              onClick={() => processPromotionEditForm()}
            >
              {t("Edit promotion")}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
