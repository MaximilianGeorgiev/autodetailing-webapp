import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import ButtonGroup from "@mui/material/ButtonGroup";

import { getPromotionById, deletePromotion } from "../../api/promotion";
import { getProductById } from "../../api/product";
import { getServiceById } from "../../api/service";
import { ConfirmationDialog } from "../custom/ConfirmationDialog";

import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

export const ShowPromotion = () => {
  const [promotionInfo, setPromotionInfo] = useState();
  const [entityType, setEntityType] = useState("");
  const [entity, setEntity] = useState({});
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    getPromotionById(id).then((res) => {
      if (res.data?.status === "failed") {
        navigate(`/`);
        return;
      }

      if (res.data.payload[0].product_id) {
        getProductById(res.data.payload[0].product_id).then((productRes) => {
          if (productRes?.data.status === "success")
            setEntity(productRes.data.payload[0]);
        });

        setEntityType("product");
      } else if (res.data.payload[0].service_id) {
        getServiceById(res.data.payload[0].service_id).then((serviceRes) => {
          if (serviceRes?.data.status === "success")
            setEntity(serviceRes.data.payload[0]);
        });

        setEntityType("service");
      }

      setPromotionInfo(res.data.payload[0]);
    });
  }, []);

  const deleteButtonOnClick = () => {
    deletePromotion(id).then((res) => {
      navigate("/promotions/show");
      setShowConfirmationDialog(false);
    });
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
          <Typography variant="h3" gutterBottom component="div">
            Promotion{" "}
            {promotionInfo?.promotion_id
              ? "№ " + promotionInfo?.promotion_id
              : ""}
          </Typography>
          <Divider variant="middle" />
          <Typography variant="subtitle1" gutterBottom component="div">
            Start date:{" "}
            {promotionInfo?.promotion_from
              ? new Date(promotionInfo.promotion_from).toLocaleDateString()
              : ""}
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            End date:{" "}
            {promotionInfo?.promotion_to
              ? new Date(promotionInfo.promotion_to).toLocaleDateString()
              : ""}
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            Price:{" "} BGN
            {promotionInfo?.promotion_new_price
              ? promotionInfo.promotion_new_price
              : ""}
          </Typography>

          {entityType === "service" && (
            <Typography variant="subtitle1" gutterBottom component="div">
              For service: {entity?.service_title ? entity.service_title : ""}
            </Typography>
          )}

          {entityType === "product" && (
            <Typography
              onClick={() => navigate(`/products/show/${entity.product_id}`)}
              sx={{ textDecoration: "underline" }}
              variant="subtitle1"
              gutterBottom
              component="div"
            >
              For product: {entity?.product_title ? entity.product_title : ""}
            </Typography>
          )}
          <Divider variant="middle" />
          {entityType === "service" && (
            <Button
              variant="contained"
              color="secondary"
              component="span"
              startIcon={<LibraryBooksIcon />}
              sx={{marginTop: 3}}
            >
              Book now
            </Button>
          )}
          {entityType === "product" && (
            <Button
              variant="contained"
              color="secondary"
              component="span"
              startIcon={<AddShoppingCartIcon />}
              sx={{marginTop: 3}}
            >
              Buy now
            </Button>
          )}
          <Divider variant="middle" />
          <ButtonGroup fullWidth sx={{ marginTop: 4 }}>
            <Button
              sx={{}}
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/promotions/edit/${id}`)}
            >
              Edit
            </Button>
            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => setShowConfirmationDialog(true)}
            >
              Delete
            </Button>
          </ButtonGroup>
          {showConfirmationDialog && (
            <ConfirmationDialog
              handleClose={() => setShowConfirmationDialog(false)}
              handleConfirm={deleteButtonOnClick}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};
