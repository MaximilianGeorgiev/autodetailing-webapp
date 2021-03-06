import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAllServices, getServicePicturePaths } from "../../api/service";
import { getAllProducts, getProductPicturePaths } from "../../api/product";
import { getAllBlogs, getBlogPicturePaths } from "../../api/blog";
import { useNavigate } from "react-router-dom";
import { getPromotionByServiceId, getPromotionByProductId } from "../../api/promotion";
import { useState, useEffect } from "react";


// props:
// entityType: service, product, blog
// isPreview: boolean; displays 3 entities only if it is for the home page, lists all if it is for view pages
export const EntityCards = (props) => {
  const [entities, setEntities] = useState({});
  const [entityPictures, setEntityPictures] = useState([]);
  const [picturesLoaded, setPicturesLoaded] = useState(false);
  const [activePromotion, setActivePromotion] = useState([]);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const navigate = useNavigate();
  const { t } = useTranslation();

  const Item = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    let updatedPaths = [...entityPictures];
    let entities = [];

    if (props.entityType === "service") {
      getAllServices().then((res) => {
        if (res.data.status === "success") {
          const services = props.isPreview
            ? res.data.payload.filter((val, index, arr) => index + 4 >= arr.length)
            : res.data.payload;
          entities = services;

          // iterate through all services and get one picture for thumbnail and active promotions
          for (let i = 0; i < services.length; i++) {
            getServicePicturePaths(services[i].service_id).then((res) => {
              if (res.data?.status === "success") {
                updatedPaths.push({
                  id: services[i].service_id,
                  path: res.data.payload[0]?.picture_path,
                }); // take one picture for thumbnail
              }
            });

            getPromotionByServiceId(services[i].service_id).then((promoRes) => {
              if (promoRes.data?.status === "success") {
                if (promoRes.data.payload.length !== 0) {
                  for (let i = 0; i < promoRes.data.payload.length; i++) {
                    const promotionTo = new Date(
                      promoRes.data.payload[i].promotion_to
                    );

                    const promotionFrom = new Date(
                      promoRes.data.payload[i].promotion_from
                    );

                    const now = new Date();

                    if (now >= promotionFrom && now <= promotionTo) {
                      setActivePromotion((prevState) => [
                        ...prevState,
                        { entityId: promoRes.data.payload[i].service_id, hasPromotion: true, promotionInfo: promoRes.data.payload[i] }
                      ]);
                      break;
                    }
                  }
                }
              }
            });
          }
        }
      });
    } else if (props.entityType === "product") {
      getAllProducts().then((res) => {
        if (res.data.status === "success") {
          const products = props.isPreview
            ? res.data.payload.filter((val, index, arr) => index + 4 >= arr.length)
            : res.data.payload;
          entities = products;

          // get all pictures that correspond to the selected products
          for (let i = 0; i < products.length; i++) {
            getProductPicturePaths(products[i].product_id).then((res) => {
              if (res.data?.status === "success") {
                updatedPaths.push({
                  id: products[i].product_id,
                  path: res.data.payload[0].picture_path,
                }); // take one picture for thumbnail
              }
            });

            getPromotionByProductId(products[i].product_id).then((promoRes) => {
              if (promoRes.data?.status === "success") {
                if (promoRes.data.payload.length !== 0) {
                  for (let i = 0; i < promoRes.data.payload.length; i++) {
                    const promotionTo = new Date(
                      promoRes.data.payload[i].promotion_to
                    );

                    const promotionFrom = new Date(
                      promoRes.data.payload[i].promotion_from
                    );

                    const now = new Date();

                    if (now >= promotionFrom && now <= promotionTo) {
                      setActivePromotion((prevState) => [
                        ...prevState,
                        { entityId: promoRes.data.payload[i].product_id, hasPromotion: true, promotionInfo: promoRes.data.payload[i] }
                      ]);
                      break;
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
    else if (props.entityType === "blog") {
      getAllBlogs().then((res) => {
        if (res.data.status === "success") {
          const blogs = props.isPreview
            ? res.data.payload.filter((val, index, arr) => index + 4 >= arr.length)
            : res.data.payload;
          entities = blogs;

          // get all pictures that correspond to the selected blogs
          for (let i = 0; i < blogs.length; i++) {
            getBlogPicturePaths(blogs[i].blog_id).then((res) => {
              if (res.data?.status === "success") {
                updatedPaths.push({
                  id: blogs[i].blog_id,
                  path: res.data.payload[0]?.picture_path,
                }); // take one picture for thumbnail
              }
            });
          }
        }
      });
    }


    setTimeout(() => {
      setEntityPictures(updatedPaths);
      setEntities(entities);
      setPicturesLoaded(true);
    }, 900);
  }, []);

  const displayTitle = (id) => {
    if (!id) return "";

    if (props.entityType === "service")
      return entities.filter((e) => e.service_id === id)[0]?.service_title;
    else if (props.entityType === "product")
      return entities.filter((e) => e.product_id === id)[0]?.product_title;
    else if (props.entityType === "blog")
      return entities.filter((e) => e.blog_id === id)[0]?.blog_title;

    return "";
  };

  const displayFullPrice = (id) => {
    if (!id) return "";

    if (props.entityType === "service")
      return (
        parseFloat(entities.filter((e) => e.service_id === id)[0]?.service_price).toFixed(2) + " " + t("BGN")
      );
    else if (props.entityType === "product")
      return (
        parseFloat(entities.filter((e) => e.product_id === id)[0]?.product_price).toFixed(2) + " " + t("BGN")
      );

    return "";
  };

  const displayPromotionPrice = (id) => {
    if (!id) return "";

    const entityPromotion = activePromotion.filter((promo) => promo.entityId === id)[0];
    return parseFloat(entityPromotion.promotionInfo.promotion_new_price).toFixed(2) + " " + t("BGN");
  };

  const displayText = (id) => {
    if (!id) return "";

    if (props.entityType === "blog") return (entities.filter((e) => e.blog_id === id)[0]?.blog_text);
    else if (props.entityType === "service") return (entities.filter((e) => e.service_id === id)[0]?.service_description);
    else if (props.entityType === "product") return (entities.filter((e) => e.product_id === id)[0]?.product_description);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1, ml: 2, mt: 10.5 }}>
        <Grid container spacing={2}>
          {picturesLoaded && (
            <>
              {entityPictures.map((pic) => (<Grid item xs={2}><Item>
                <CardActionArea onClick={() => navigate(`/${props.entityType}s/show/${pic.id}`)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={pic.path}
                  />
                  <CardContent height="100%">
                    <Typography gutterBottom variant="h5" component="div" noWrap>
                      {displayTitle(pic.id)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {displayText(pic.id)}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="h6" mt={3}>
                      {
                        activePromotion.filter((promo) => promo.entityId === pic.id).length === 0
                          ? displayFullPrice(pic.id)
                          : (<><s>{displayFullPrice(pic.id)}</s> {displayPromotionPrice(pic.id)}</>)
                      }
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Item>
              </Grid>))}
            </>
          )} {props.isPreview &&
            <Grid item xs={2}>
              <Item>
                <CardActionArea onClick={() => navigate(`/${props.entityType}s`)}>
                  <CardMedia component="img"
                    height={props.entityType === "blog" ? 246 : 284}
                    image={'http://localhost:8080/uploads/black.jpg'}
                  >
                  </CardMedia>
                  <CardContent height="100%">
                    <Typography gutterBottom variant="h5" component="div" noWrap>
                      {t(`Show all ${props.entityType}s`)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Item>
            </Grid>}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
