import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';

import { getProductById, getProductPicturePaths } from "../../api/product";
import { useParams } from 'react-router';
import { useNavigate } from "react-router-dom";

import ImageList from '@mui/material/ImageList';
import Image from 'material-ui-image';
import Button from '@mui/material/Button';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export const ShowProduct = () => {
    const [productInfo, setProductInfo] = useState();
    const [picturePaths, setPicturePaths] = useState({});

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

    return (
        <ThemeProvider theme={darkTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h2" gutterBottom component="div">
                        {productInfo?.product_title ? productInfo.product_title : ""}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom component="div">
                        Description: {productInfo?.product_description ? productInfo.product_description : ""}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom component="div">
                        Price: {productInfo?.product_price ? productInfo.product_price : ""}
                    </Typography>
                    {picturesLoaded &&
                        <ImageList sx={{ width: 450, height: 150 }} cols={3} rowHeight={164}>
                            {picturePaths.map((path) => (
                                <Image
                                    src={`${path}?w=164&h=164&fit=crop&auto=format`}
                                />
                            ))}
                        </ImageList>}
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/products/edit/${id}`)}
                    >
                        Edit
                    </Button>
                    <Button color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => { }}
                    >
                        Delete
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
};