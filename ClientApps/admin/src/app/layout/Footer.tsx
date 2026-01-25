import { Box, Container, Typography } from "@mui/material";
import CopyrightIcon from '@mui/icons-material/Copyright';
import { useLocation } from "react-router";



export default function Footer() {

    const { pathname } = useLocation();
  
    return (
    <Box sx={{ flexGrow: 1, mt: pathname === "/login" ? 35 : 0 }}>
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          backgroundColor: "black",
          minHeight: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography sx={{ color: "gray", fontSize: 15, display: "flex", alignItems: "center" }}>
          <CopyrightIcon 
            sx={{ color: "gray", fontSize: 15, mr: 1 }} 
          />
          Copyright 2025
        </Typography>
      </Container>
    </Box>
  );
}
