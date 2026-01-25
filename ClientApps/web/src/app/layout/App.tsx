import { Outlet } from "react-router"
import Footer from "./Footer"
import NavBar from "./NavBar"
import { ScrollToTop } from "./ScrollToTop"

function App() {
  
  return (
    <>
      <ScrollToTop />
      <NavBar />      
      <div id="appScroll" className="container-fluid m-0 p-0 px-0">
        <Outlet/>  
      </div>
      
      <Footer />
    </>
  )
}

export default App
