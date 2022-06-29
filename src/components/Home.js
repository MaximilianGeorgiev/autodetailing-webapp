import { EntityCards } from "./custom/EntityCards";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Navigate } from "react-router-dom";

export const Home = () => {
  const { t } = useTranslation();

  const Item = styled(EntityCards)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


  return (
    <Box sx={{ width: '100%' }} m={14}>
      <Stack>
        <Typography variant="h4" mb={-7} ml={2}>{t("Blogs")}</Typography>
        <Item entityType="blog" isPreview={true} />
        <Typography variant="h4" mb={-7} ml={2} mt={3}>{t("Services")}</Typography>
        <Item entityType="service" isPreview={true} />
        <Typography variant="h4" mb={-7} ml={2} mt={3}>{t("Products")}</Typography>
        <Item entityType="product" isPreview={true} />
      </Stack>
    </Box>
  );
};
