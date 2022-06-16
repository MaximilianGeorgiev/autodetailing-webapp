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
import EditIcon from '@mui/icons-material/Edit';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import { getAllCategories } from "../../api/category";
import { updateProduct, getProductById } from "../../api/product";
import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";

import { handlePictureUpload } from "../../api/picture";

import { useParams } from 'react-router';

export const EditProduct = (props) => {
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const navigate = useNavigate();
    const { id } = useParams(); // query param from url

    const [categories, setCategories] = useState([]); // dropdown options
    const [uploadedPictures, setUploadedPictures] = useState();

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
        if (!hasCookies) navigate("/", { state: { "event": "loggedOut" } });

        // don't permit non moderator and non admin users to access this page (redirect)
        const userRoles = getCookieByName("user_roles");

        /*
        if (!userRoles.includes("Moderator") && !userRoles.includes("Admin")) {
          navigate("/", { state: { "event": "loggedIn" } });
          return;
        }*/

        // get available categories
        getAllCategories().then((res) => {
            let categories = [];

            res?.data?.payload.forEach((category) => categories.push(category));
            setCategories([...categories]);
        });

        // prepopulate edit form

        getProductById(id).then((res) => {
            if (res.data?.status === "failed") {
                navigate(`/products/show/${id}`);
                return;
            }

            const product = res.data?.payload[0];
            let updatedState = { ...inputValues };

            updatedState.title = {
                value: product.product_title,
                error: inputValues.title.error,
                errorMsg: inputValues.title.errorMsg
            };

            updatedState.description = {
                value: product.product_description,
                error: inputValues.description.error,
                errorMsg: inputValues.description.errorMsg
            };

            updatedState.price = {
                value: product.product_price,
                error: inputValues.price.error,
                errorMsg: inputValues.price.errorMsg
            };

            updatedState.category = {
                value: product.category_id,
                error: inputValues.category.error,
                errorMsg: inputValues.category.errorMsg
            };

            setInputValues(updatedState);
        });
    }, []);

    const processProductEditForm = () => {
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
            updateProduct(
                id,
                inputValues.title.value,
                inputValues.description.value,
                inputValues.price.value,
                inputValues.category.value
            ).then((res) => {
                if (res.data?.status === "success") navigate(`/products/show/${id}`,
                    { state: { success: "true", message: "Update successful." } });
                else navigate(`/products/show/${id}`,
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
                        Edit product
                    </Typography>
                    <Box noValidate sx={{ mt: 1 }}>
                        <TextField
                            name="title"
                            type="text"
                            placeholder="Product name"
                            label="Product name"
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
                            placeholder="Description"
                            label="Description"
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
                            value={
                                inputValues["price"]?.value
                                    ? inputValues["price"].value
                                    : ""
                            }
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
                                inputValues["category"]?.error
                                    ? inputValues["category"].error
                                    : false
                            }
                            helperText={
                                inputValues["category"]?.errorMsg
                                    ? inputValues["category"].errorMsg
                                    : ""
                            }
                            fullWidth
                            margin="normal"
                        >
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
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
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={(e) => {
                                setUploadedPictures(e.target.files)
                            }}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="raised" component="span">
                                Upload
                            </Button>
                        </label>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => processProductEditForm()}
                        >
                            Edit product
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
