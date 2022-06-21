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
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import ImageList from "@mui/material/ImageList";
import Image from "material-ui-image";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import { ConfirmationDialog } from "../custom/ConfirmationDialog";
import { Reservation } from "../custom/Reservation";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

export const ShowService = () => {
  const [serviceInfo, setServiceInfo] = useState();
  const [picturePaths, setPicturePaths] = useState({});

  // paths are fetched after rendering is done so they must be awaited
  const [picturesLoaded, setPicturesLoaded] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showReservation, setShowReservation] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
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
  }, []);

  const deleteButtonOnClick = () => {
    deleteService(id).then((res) => {
      navigate("/services/show");
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
            Description:{" "}
            {serviceInfo?.service_description
              ? serviceInfo.service_description
              : ""}
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            Price: {serviceInfo?.service_price ? serviceInfo.service_price : ""}{" "}
            BGN
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
            Book now
          </Button>
          {showReservation && (
            <Reservation
              handleClose={() => setShowReservation(false)}
            />
          )}
          <ButtonGroup fullWidth sx={{ marginTop: 4 }}>
            <Button
              sx={{}}
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/services/edit/${id}`)}
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
