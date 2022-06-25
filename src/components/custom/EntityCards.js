import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

import { getAllServices, getServicePicturePaths } from "../../api/service";
import { getAllProducts, getProductPicturePaths } from "../../api/product";
import { getAllBlogs, getBlogPicturePaths } from "../../api/blog";
import { useNavigate } from "react-router-dom";
import { getPromotionByServiceId, getPromotionByProductId } from "../../api/promotion";

// props:
// entityType: product/service
// hasImages: boolean
export const EntityCards = (props) => {
  // fetch the latest 3 entities so they can be fitted
  const [entities, setEntities] = useState({});
  const [entityPictures, setEntityPictures] = useState([]);
  const [picturesLoaded, setPicturesLoaded] = useState(false);
  const [activePromotion, setActivePromotion] = useState({
    hasPromotion: false,
    promotionInfo: {}
  });

  const navigate = useNavigate();

  useEffect(() => {
    let updatedPaths = [...entityPictures];
    let entities = [];

    if (props.entityType === "service") {
      getAllServices().then((res) => {
        if (res.data.status === "success") {
          const services = res.data.payload.filter(
            (val, index, arr) => index + 2 >= arr.length
          );
          entities = services;

          // iterate through all services and get one picture for thumbnail and active promotions
          for (let i = 0; i < services.length; i++) {
            getServicePicturePaths(services[i].service_id).then((res) => {
              if (res.data?.status === "success") {
                updatedPaths.push({
                  id: services[i].service_id,
                  path: res.data.payload[0].picture_path,
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
                      setActivePromotion({ hasPromotion: true, promotionInfo: promoRes.data.payload[i] });
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
          const products = res.data.payload.filter(
            (val, index, arr) => index + 2 >= arr.length
          );
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
                      setActivePromotion({ hasPromotion: true, promotionInfo: promoRes.data.payload[i] });
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
          const blogs = res.data.payload.filter(
            (val, index, arr) => index + 2 >= arr.length
          );
          entities = blogs;

          // get all pictures that correspond to the selected blogs
          for (let i = 0; i < blogs.length; i++) {
            getBlogPicturePaths(blogs[i].blog_id).then((res) => {
              if (res.data?.status === "success") {
                updatedPaths.push({
                  id: blogs[i].blog_id,
                  path: res.data.payload[0].picture_path,
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
    }, 450);
  }, []);

  const displayTitle = (id) => {
    if (!id) return "";

    if (props.entityType === "service")
      return entities.filter((e) => e.service_id === id)[0].service_title;
    else if (props.entityType === "product")
      return entities.filter((e) => e.product_id === id)[0].product_title;
    else if (props.entityType === "blog")
      return entities.filter((e) => e.blog_id === id)[0].blog_title;

    return "";
  };

  const displayFullPrice = (id) => {
    if (!id) return "";

    if (props.entityType === "service")
      return (
        entities.filter((e) => e.service_id === id)[0].service_price + " BGN"
      );
    else if (props.entityType === "product")
      return (
        entities.filter((e) => e.product_id === id)[0].product_price + " BGN"
      );

    return "";
  };

  const displayPromotionPrice = (id) => {
    if (!id) return "";

    return activePromotion.promotionInfo.promotion_new_price + " BGN";
  };

  const displayText = (id) => {
    if (!id) return "";

    if (props.entityType === "blog") return (entities.filter((e) => e.blog_id === id)[0].blog_text);
  };

  return (
    <>
      {picturesLoaded && (
        <ImageList display="flex" sx={{ flex: 1, flexDirection: 'row', width: 577, height: 350 }}>
          <ImageListItem key="Subheader" cols={2} sx={{ flex: 1 }}>
            <Typography gutterBottom variant="h5" component="div">
              {props.entityType === "service" ? "Services" : props.entityType === "blog" ? "Blogs" : "Products"}
            </Typography>
          </ImageListItem>
          {entityPictures.map((pic) => (
            <ImageListItem key={pic.path} sx={{ flex: 1 }}>
              <img
                src={`${pic.path}?w=248&fit=crop&auto=format`}
                srcSet={`${pic.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={""}
                loading="lazy"
              />
              <ImageListItemBar
                title={displayTitle(pic.id)}
                subtitle={props.entityType === "blog" ? displayText(pic.id) :
                  activePromotion.hasPromotion ? (<><s>{displayFullPrice(pic.id)}</s> {displayPromotionPrice(pic.id)}</>) :
                    displayFullPrice(pic.id)}
                actionIcon={
                  <IconButton
                    sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                    aria-label={`info about ${pic.id}`}
                    onClick={() => {
                      navigate(`/${props.entityType}s/show/${pic.id}`);
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </>
  );
};
