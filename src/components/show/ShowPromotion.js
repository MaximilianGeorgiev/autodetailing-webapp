import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';

import { getPromotionById } from "../../api/promotion";
import { getProductById } from "../../api/product";
import { getServiceById } from "../../api/service";

import { useParams } from 'react-router';
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export const ShowPromotion = () => {
    const [promotionInfo, setPromotionInfo] = useState();
    const [entityType, setEntityType] = useState("");
    const [entity, setEntity] = useState({});

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
                        setEntity(productRes.data.payload[0])
                });

                setEntityType("product");
            }
            else if (res.data.payload[0].service_id) {
                getServiceById(res.data.payload[0].service_id).then((serviceRes) => {
                    if (serviceRes?.data.status === "success")
                        setEntity(serviceRes.data.payload[0])
                });

                setEntityType("service");
            }

            setPromotionInfo(res.data.payload[0]);
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
                        Promotion {promotionInfo?.promotion_id ? "№ " + promotionInfo?.promotion_id : ""}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom component="div">
                        Start date: {promotionInfo?.promotion_from ? promotionInfo.promotion_from : ""}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom component="div">
                        End date: {promotionInfo?.promotion_to ? promotionInfo.promotion_to : ""}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom component="div">
                        Price: {promotionInfo?.promotion_new_price ? promotionInfo.promotion_new_price : ""}
                    </Typography>

                    {entityType === "service" &&
                        <Typography variant="subtitle1" gutterBottom component="div">
                            For service: {entity?.service_title ? entity.service_title : ""}
                        </Typography>
                    }

                    {entityType === "product" &&
                        <Typography
                            onClick={() => navigate(`/products/show/${entity.product_id}`)}
                            sx={{ textDecoration: 'underline' }}
                            variant="subtitle1"
                            gutterBottom
                            component="div">
                            For product: {entity?.product_title ? entity.product_title : ""}
                        </Typography>
                    }

                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/promotions/edit/${id}`)}
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