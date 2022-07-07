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
  getBlogById,
  getBlogPicturePaths,
  deleteBlog
} from "../../api/blog";
import { getCookieByName } from "../../utils/cookies";

import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import Image from "material-ui-image";
import Button from "@mui/material/Button";


import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const ShowBlog = () => {
  const [blogInfo, setBlogInfo] = useState();
  const [picturePaths, setPicturePaths] = useState({});
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // paths are fetched after rendering is done so they must be awaited
  const [picturesLoaded, setPicturesLoaded] = useState(false);

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

    if (userRoles.includes("Moderator") || userRoles.includes("Admin"))
      setHasPermission(true);

    getBlogPicturePaths(id).then((res) => {
      if (res.data?.status === "success") {
        let paths = [];

        res?.data?.payload.forEach((path) => paths.push(path.picture_path));
        setPicturePaths([...paths]);
        setPicturesLoaded(true);
      }
    });

    getBlogById(id).then((res) => {
      if (res.data?.status === "failed") {
        navigate(`/`);
        return;
      }

      setBlogInfo(res.data.payload[0]);
    });
  }, []);

  const deleteButtonOnClick = () => {
    deleteBlog(id).then((res) => {
      navigate("/blogs");
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
            {blogInfo?.blog_title ? blogInfo.blog_title : ""}
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            {blogInfo?.blog_text
              ? blogInfo.blog_text : ""}
          </Typography>
          {picturesLoaded && (
            picturePaths.map((path) => (
              <Image src={`${path}?w=164&h=124&fit=crop&auto=format`} />
            ))
          )}
          {hasPermission &&
            <ButtonGroup fullWidth sx={{ marginTop: 4 }}>
              <Button
                sx={{}}
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/blogs/edit/${id}`)}
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
