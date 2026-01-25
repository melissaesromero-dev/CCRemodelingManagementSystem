import { createBrowserRouter,} from "react-router";
import App from "../layout/App";
import Home from "../../features/Home/Home";
import Services from "../../features/Services/Services";
import Gallery from "../../features/Gallery/Gallery";
import ContactUs from "../../features/ContactUs/ContactUs";
import Quote from "../../features/Quote/Quote";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path: '', element: <Home/>},
            {path: 'home', element: <Home />},

            {path: 'services', element: <Services />},
            {path: 'gallery', element: <Gallery />},
            {path: 'contactUs', element: <ContactUs />},
            {path: 'quote', element: <Quote />},
            
        ]
    }
])