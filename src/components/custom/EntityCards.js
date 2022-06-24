import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

import { getAllServices, getServicePicturePaths } from "../../api/service";
import { getAllProducts, getProductPicturePaths } from "../../api/product";
import { getAllBlogs, getBlogPicturePaths } from "../../api/blog";
import { useNavigate } from "react-router-dom";

// props:
// entityType: product/service
// hasImages: boolean
export const EntityCards = (props) => {
  // fetch the latest 3 entities so they can be fitted
  const [entities, setEntities] = useState({});
  const [entityPictures, setEntityPictures] = useState([]);
  const [picturesLoaded, setPicturesLoaded] = useState(false);

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

          for (let i = 0; i < services.length; i++) {
            getServicePicturePaths(services[i].service_id).then((res) => {
              if (res.data?.status === "success") {
                updatedPaths.push({
                  id: services[i].service_id,
                  path: res.data.payload[0].picture_path,
                }); // take one picture for thumbnail
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

  const displayPrice = (id) => {
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

  const displayText = (id) => {
    if (!id) return "";

    if (props.entityType === "blog") return (entities.filter((e) => e.blog_id === id)[0].blog_text);
  };

  return (
    <>
      {picturesLoaded && (
        <ImageList sx={{ width: 577, height: 350 }}>
          <ImageListItem key="Subheader" cols={2}>
            <Typography gutterBottom variant="h5" component="div">
              {props.entityType === "service" ? "Services" : props.entityType === "blog" ? "Blogs" : "Products"}
            </Typography>
          </ImageListItem>
          {entityPictures.map((pic) => (
            <ImageListItem key={pic.path}>
              <img
                src={`${pic.path}?w=248&fit=crop&auto=format`}
                srcSet={`${pic.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={""}
                loading="lazy"
              />
              <ImageListItemBar
                title={displayTitle(pic.id)}
                subtitle={props.entityType === "blog" ? displayText(pic.id) : displayPrice(pic.id)}
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
