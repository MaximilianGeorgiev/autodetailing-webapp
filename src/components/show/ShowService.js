import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";

import {
  getServiceById,
  getServicePicturePaths,
  deleteService,
} from "../../api/service";
import { getPromotionByServiceId } from "../../api/promotion";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ImageList from "@mui/material/ImageList";
import Image from "material-ui-image";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import { ConfirmationDialog } from "../custom/ConfirmationDialog";
import { Reservation } from "../custom/Reservation";
import { getCookieByName } from "../../utils/cookies";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SellIcon from "@mui/icons-material/Sell";

export const ShowService = () => {
  const [serviceInfo, setServiceInfo] = useState();
  const [picturePaths, setPicturePaths] = useState({});

  // paths are fetched after rendering is done so they must be awaited
  const [picturesLoaded, setPicturesLoaded] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [activePromotion, setActivePromotion] = useState({
    hasPromotion: false,
    promotionInfo: {},
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    // non admin and moderator users shouldn't see edit and delete buttons
    const userRoles = getCookieByName("user_roles");

    if (userRoles.includes("Admin"))
      setHasPermission(true);

    getServicePicturePaths(id).then((res) => {
      if (res.data?.status === "success") {
        let paths = [];

        res?.data?.payload.forEach((path) => paths.push(path.picture_path));
        
        setPicturePaths([...paths]);
        setPicturesLoaded(true);
      }
    });

    getServiceById(id).then((res) => {
      if (res.data?.status === "failed") {
        navigate(`/`);
        return;
      }

      setServiceInfo(res.data.payload[0]);
    });

    getPromotionByServiceId(id).then((res) => {
      if (res.data?.status === "success") {
        if (res.data.payload.length !== 0) {
          for (let i = 0; i < res.data.payload.length; i++) {
            const promotionTo = new Date(res.data.payload[i].promotion_to);

            const promotionFrom = new Date(res.data.payload[i].promotion_from);

            const now = new Date();

            if (now >= promotionFrom && now <= promotionTo) {
              setActivePromotion({
                hasPromotion: true,
                promotionInfo: res.data.payload[i],
              });
              break;
            }
          }
        }
      }
    });
  }, []);

  const deleteButtonOnClick = () => {
    deleteService(id).then((res) => {
      navigate("/services");
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
            display: "block",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" gutterBottom component="div">
            {serviceInfo?.service_title ? serviceInfo.service_title : ""}
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            {serviceInfo?.service_description
              ? serviceInfo.service_description
              : ""}
          </Typography>
          {activePromotion.hasPromotion === true && (
            <React.Fragment>
              <Typography
                variant="h5"
                gutterBottom
                component="div"
                color="green"
                mt={3}
              >
                <SellIcon sx={{ marginRight: 1 }} />
                {t("This service has an ongoing promotion until")}{" "}
                {new Date(
                  activePromotion.promotionInfo.promotion_to
                ).toLocaleDateString()}
              </Typography>
              <Typography
                color="red"
                variant="h5"
                gutterBottom
                component="div"
                mt={3}
                style={{ textDecoration: "line-through" }}
              >
                {t("Old price:")}{" "}
                {serviceInfo?.service_price ? serviceInfo.service_price : ""}{" "}
                {t("BGN")}
              </Typography>
            </React.Fragment>
          )}
          <Typography variant="h5" gutterBottom component="div" mt={3}>
            {t("Price:")}{" "}
            {activePromotion?.promotionInfo?.promotion_new_price
              ? activePromotion.promotionInfo.promotion_new_price
              : serviceInfo?.service_price}{" "}
            {t("BGN")}
          </Typography>
          {picturesLoaded && (
            <ImageList
              sx={{ width: "100%", height: 132 }}
              cols={3}
              rowHeight={164}
            >
              {picturePaths.map((path) => (
                <Image src={`${path}?w=164&h=164&fit=crop&auto=format`} />
              ))}
            </ImageList>
          )}
          <Button
            variant="contained"
            color="secondary"
            component="span"
            startIcon={<LibraryBooksIcon />}
            sx={{ marginTop: 3, margin: "0 auto", display: "flex" }}
            style={{ justifyContent: "center" }}
            onClick={() => setShowReservation(true)}
          >
            {t("Book now")}
          </Button>
          {showReservation && (
            <Reservation
              handleClose={() => setShowReservation(false)}
              service={serviceInfo}
            />
          )}
          {hasPermission && (
            <ButtonGroup fullWidth sx={{ marginTop: 4 }}>
              <Button
                sx={{}}
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/services/edit/${id}`)}
              >
                {t("Edit")}
              </Button>
              <Button
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setShowConfirmationDialog(true)}
              >
                {t("Delete")}
              </Button>
            </ButtonGroup>
          )}
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
