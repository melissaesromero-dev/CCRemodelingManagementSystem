import { ThemeProvider, CssBaseline, Container, Toolbar} from "@mui/material";
import { theme } from "./Themes/theme";
import HeaderBar from "./HeaderBar";
import { Outlet , useLocation} from "react-router";
import BreadCrumb from "./BreadCrumb";
import { ScrollToTop } from "./ScrollToTop";
import Footer from "./Footer";

function App() {
  const { pathname } = useLocation();
  
  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollToTop />
      <HeaderBar />
      {pathname !== "/login" &&<BreadCrumb />}
      
      <Toolbar disableGutters />  
      
      <Container maxWidth='xl' sx={{mt: 2.5, mb:3, minHeight:"62vh"}}>
        <Outlet/>  
      </Container>
      
      <Footer/>
    </ThemeProvider>  
    </>   
  )
}

export default App
