import { AccountCircle } from "@mui/icons-material";
import { Box, AppBar, Toolbar, Container, Link, Typography, LinearProgress } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router";
import { Observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import { useAccount } from "../../hooks/useAccount";

export default function HeaderBar() {
  const {loadingStore} = useStore();
  const { pathname } = useLocation();
  const { currentUser, logoutUser } = useAccount();

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={1} 
              sx={{backgroundImage: 'linear-gradient(135deg, #E5E5E5 15%, #7F837D 57%, #333A2F 95%)',
                   py:1
              }}>
        <Container maxWidth='xl' disableGutters>
          <Toolbar sx={{px: 2}} disableGutters>
            <Box component="img"
              src="/images/CCRemodelingLogo_noBg.png"
              alt="C&C Remodeling Logo"
              sx={{width: 250, display: "block"}}
            />
            {currentUser && location.pathname !== "/login" 
            ? ( <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
                    <AccountCircle sx={{ fontSize: 18 }} aria-hidden />
                    <Typography variant="inherit">{currentUser.fullName}</Typography>
                    <Typography variant="inherit" aria-hidden="true">
                      |
                    </Typography>
                    <Link component={RouterLink} to="" onClick={() => {
                        logoutUser.mutate();
                      }} underline="none" color="tertiary.main">Logout</Link>
              </Box>)
            : ""}
           
          </Toolbar>
        </Container>

      {pathname === "/" && (
      <Observer>
        {() =>
          loadingStore.isLoading ? (
            <LinearProgress
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: "darkgray",
                "& .MuiLinearProgress-bar": { backgroundColor: "lightgray" },
              }}
            />
          ) : null
        }
      </Observer>
    )}
      
        
      </AppBar>
      <Toolbar />
    </Box>
    
    </>
  )
}