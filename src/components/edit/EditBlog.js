import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from "@mui/material/MenuItem";
import ImageList from '@mui/material/ImageList';

import Image from 'material-ui-image';

import { updateBlog, getBlogById, getBlogPicturePaths } from "../../api/blog";
import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";

import { handlePictureUpload, handlePictureDelete } from "../../api/picture";

import { useParams } from 'react-router';

export const EditBlog = (props) => {
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const navigate = useNavigate();
    const { id } = useParams(); // query param from url

    const [uploadedPictures, setUploadedPictures] = useState();

    const [deletedPictures, setDeletedPictures] = useState([]);
    const [additionalPictures, setAdditionalPictures] = useState([]); // to be uploaded during edit

    // paths are fetched after rendering is done so they must be awaited
    const [picturesLoaded, setPicturesLoaded] = useState(false);

    const [inputValues, setInputValues] = useState({
        title: { value: "", error: false, errorMsg: "" },
        text: { value: "", error: false, errorMsg: "" },
    });

    useEffect(() => {
        // don't allow non logged in users to access this page
        const hasCookies = clientHasLoginCookies();
        if (!hasCookies) navigate("/", { state: { "event": "loggedOut" } });

        // don't permit non moderator and non admin users to access this page (redirect)
        const userRoles = getCookieByName("user_roles");

        if (!userRoles.includes("Moderator") && !userRoles.includes("Admin")) {
            navigate("/", { state: { "event": "loggedIn" } });
            return;
        }

        // get all pictures that correspond to this blog
        getBlogPicturePaths(id).then((res) => {
            if (res.data?.status === "success") {
                let paths = [];

                res?.data?.payload.forEach((path) => paths.push(path.picture_path));
                setUploadedPictures([...paths]);
                setPicturesLoaded(true);
            }
        });

        // prepopulate edit form
        getBlogById(id).then((res) => {
            if (res.data?.status === "failed") {
                navigate(`/blogs/show/${id}`);
                return;
            }

            const blog = res.data?.payload[0];
            let updatedState = { ...inputValues };

            updatedState.title = {
                value: blog.blog_title,
                error: inputValues.title.error,
                errorMsg: inputValues.title.errorMsg
            };

            updatedState.text = {
                value: blog.blog_text,
                error: inputValues.text.error,
                errorMsg: inputValues.text.errorMsg
            };

            setInputValues(updatedState);
        });
    }, []);

    const processBlogEditForm = () => {
        let updatedState = { ...inputValues };

        if (!inputValues?.title?.value)
            updatedState.title = {
                value: updatedState.title.value,
                error: true,
                errorMsg: "Blog title cannot be empty.",
            };

        if (!inputValues?.text?.value)
            updatedState.text = {
                value: updatedState.text.value,
                error: true,
                errorMsg: "Blog text cannot be empty.",
            };


        // case: subsequent error requests but one of the fields is corrected
        if (inputValues?.title?.value)
            updatedState.title = {
                value: updatedState.title.value,
                error: false,
                errorMsg: "",
            };

        if (inputValues?.text?.value)
            updatedState.text = {
                value: updatedState.text.value,
                error: false,
                errorMsg: "",
            };

        if (
            inputValues?.title?.value &&
            inputValues?.text?.value
        ) {
            // remove any pictures if needed
            if (deletedPictures.length !== 0) {
                for (let i = 0; i < deletedPictures.length; i++)
                    handlePictureDelete("blog", id, deletedPictures[i]);
            }

            // add more pictures if needed
            if (additionalPictures.length !== 0)
                handlePictureUpload("blog", id, additionalPictures);

            updateBlog(
                id,
                inputValues.title.value,
                inputValues.text.value
            ).then((res) => {
                if (res.data?.status === "success") navigate(`/blogs/show/${id}`,
                    { state: { success: "true", message: "Update successful." } });
                else navigate(`/blogs/show/${id}`,
                    { state: { success: "false", message: "Update failed." } });
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
                        Edit blog
                    </Typography>
                    <Box noValidate sx={{ mt: 1 }}>
                        <TextField
                            name="title"
                            type="text"
                            placeholder="Title"
                            label="Title"
                            margin="normal"
                            fullWidth
                            value={
                                inputValues["title"]?.value
                                    ? inputValues["title"].value
                                    : ""
                            }
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
                            placeholder="Text"
                            label="Text"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                            maxRows={5}
                            value={
                                inputValues["text"]?.value
                                    ? inputValues["text"].value
                                    : ""
                            }
                            error={
                                inputValues["text"]?.error
                                    ? inputValues["text"].error
                                    : false
                            }
                            helperText={
                                inputValues["text"]?.errorMsg
                                    ? inputValues["text"].errorMsg
                                    : ""
                            }
                            onChange={(e) => {
                                setInputValues((prevInputValues) => ({
                                    ...prevInputValues,
                                    text: {
                                        value: e.target.value,
                                    },
                                }));
                            }}
                        />
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={(e) =>
                                setAdditionalPictures(e.target.files)}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="raised" component="span">
                                Upload
                            </Button>
                        </label>
                        {picturesLoaded &&
                            <ImageList sx={{ width: 450, height: 150 }} cols={3} rowHeight={164}>
                                {uploadedPictures.map((path) => (
                                    <Image
                                        src={`${path}?w=164&h=164&fit=crop&auto=format`}
                                        onClick={(e) => {
                                            // prepare for deletion, remove from the displayed ones
                                            const path = e.target.currentSrc.split("?")[0];
                                            setDeletedPictures([...uploadedPictures.filter(p => p === path)]);
                                            setUploadedPictures([...uploadedPictures.filter(p => p !== path)])
                                        }}
                                    />
                                ))}
                            </ImageList>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => processBlogEditForm()}
                        >
                            Edit blog
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
