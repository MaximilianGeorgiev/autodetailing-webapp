import { EntityCards } from "./custom/EntityCards";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";

export const Home = () => {
  const Item = styled(EntityCards)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "column", md: "column" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        display="flex"
        flexDirection="grow"
        m={8}
        alignItems="left"
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Item entityType="blog" fullWidth />
        <Item entityType="service" fullWidth />
        <Item entityType="product" fullWidth />
      </Stack>
    </Box>
  );
};
