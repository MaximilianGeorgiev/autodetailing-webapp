import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import ButtonGroup from "@mui/material/ButtonGroup";
import { ConfirmationDialog } from "../custom/ConfirmationDialog";

import {
  getProductById,
  getProductPicturePaths,
  deleteProduct,
} from "../../api/product";
import { getCookieByName } from "../../utils/cookies";
import { Order } from "../custom/Order";

import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import ImageList from "@mui/material/ImageList";
import Image from "material-ui-image";
import Button from "@mui/material/Button";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

export const ShowProduct = () => {
  const [productInfo, setProductInfo] = useState();
  const [picturePaths, setPicturePaths] = useState({});
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  // paths are fetched after rendering is done so they must be awaited
  const [picturesLoaded, setPicturesLoaded] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {

    // non admin and moderator users shouldn't see edit and delete buttons
    const userRoles = getCookieByName("user_roles");

    if (userRoles.includes("Moderator") || userRoles.includes("Admin"))
      setHasPermission(true);

    getProductPicturePaths(id).then((res) => {
      if (res.data?.status === "success") {
        let paths = [];

        res?.data?.payload.forEach((path) => paths.push(path.picture_path));
        setPicturePaths([...paths]);
        setPicturesLoaded(true);
      }
    });

    getProductById(id).then((res) => {
      if (res.data?.status === "failed") {
        navigate(`/`);
        return;
      }

      setProductInfo(res.data.payload[0]);
    });
  }, []);

  const deleteButtonOnClick = () => {
    deleteProduct(id).then((res) => {
      navigate("/products/show");
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
          <Typography variant="h3" gutterBottom component="div">
            {productInfo?.product_title ? productInfo.product_title : ""}
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            Description:{" "}
            {productInfo?.product_description
              ? productInfo.product_description
              : ""}
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            Price: {productInfo?.product_price ? productInfo.product_price : ""} BGN
          </Typography>
          {picturesLoaded && (
            <ImageList
              sx={{ width: '100%', height: 135 }}
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
            startIcon={<AddShoppingCartIcon />}
            sx={{ marginTop: 3, margin: '0 auto', display: "flex" }}
            style={{ justifyContent: 'center' }}
            onClick={() => setShowOrder(true)}
          >
            Buy now
          </Button>
          {showOrder && (
            <Order
              handleClose={() => setShowOrder(false)}
              product={productInfo}
            />
          )}
          {hasPermission && 
          <ButtonGroup fullWidth sx={{ marginTop: 4 }}>
            <Button
              sx={{}}
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/products/edit/${id}`)}
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
          }
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
