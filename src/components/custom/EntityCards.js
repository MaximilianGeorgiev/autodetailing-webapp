import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { useState, useEffect } from 'react';

import { getAllServices, getServicePicturePaths } from "../../api/service";
import { getAllProducts, getProductPicturePaths } from "../../api/product";

// props:
// entityType: product/service
// hasImages: boolean 
export const EntityCards = (props) => {
  // fetch the latest 3 entities so they can be fitted
  const [entities, setEntities] = useState({});
  const [entityPictures, setEntityPictures] = useState([]);
  const [picturesLoaded, setPicturesLoaded] = useState(false);

  useEffect(() => {
    if (props.entityType === "service") {
      getAllServices().then((res) => {
        if (res.data.status === "success") {
          const services = res.data.payload.filter((val, index, arr) => index + 3 >= arr.length);
          setEntities(services);


          for (let i = 0; i < services.length; i++) {
            getServicePicturePaths(services[i].service_id).then((res) => {
              if (res.data?.status === "success") {
                let updatedPaths = [...entityPictures];

                updatedPaths.push({ id: services[i].service_id, path: res.data.payload[0].picture_path }); // take one picture for thumbnail

                setEntityPictures(updatedPaths);
                setPicturesLoaded(true);
              }
            });
          };

        }
      });

    } else if (props.entityType === "product") {
      getAllProducts().then((res) => {
        if (res.data.status === "success") {
          const products = res.data.payload.filter((val, index, arr) => index + 3 >= arr.length);

          setEntities(products);
        }
      });

      // get all pictures that correspond to the selected services
      for (let i = 0; i < entities.length; i++) {
        getProductPicturePaths(entities[i].product_id).then((res) => {
          if (res.data?.status === "success") {
            let updatedPaths = [...entityPictures];

            updatedPaths.push({ id: entities[i].product_id, path: res.data.payload[0].picture_path }); // take one picture for thumbnail

            setEntityPictures(updatedPaths);
            setPicturesLoaded(true);
          }
        });
      };
    }
  }, []);

  const displayTitle = (id) => {
    if (!id) return "";

    if (props.entityType === "service") return entities.filter(e => e.service_id === id)[0].service_title;
    else if (props.entityType === "product") return entities.filter(e => e.product_id === id)[0].product_title;

    return "";
  }

  const displayPrice = (id) => {
    if (!id) return "";

    if (props.entityType === "service") return entities.filter(e => e.service_id === id)[0].service_price;
    else if (props.entityType === "product") return entities.filter(e => e.product_id === id)[0].product_price;

  };

  return (
    <ImageList sx={{ width: 999, height: 999 }}>
      <ImageListItem key="Subheader" cols={2}>
        <ListSubheader component="div">December</ListSubheader>
      </ImageListItem>

      {picturesLoaded === true && (entityPictures.map((pic) => {
        return (<ImageListItem key={pic.path}>
          <img
            src={`${pic.path}?w=248&fit=crop&auto=format`}
            srcSet={`${pic.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt=""
            loading="lazy"
          />
          <ImageListItemBar
            title={() => displayTitle(pic.id)}
            subtitle={() => displayPrice(pic.id)}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${pic.path}`}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </ImageListItem>)
}))
      }
    </ImageList>
  );
}