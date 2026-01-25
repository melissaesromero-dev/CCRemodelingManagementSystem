import { createBrowserRouter, Navigate,} from "react-router";
import App from "../layout/App";
import MainDashboard from "../../features/MainDashboard/MainDashboard";
import CustomerDashboard from "../../features/Customers/CustomerDashboard";
import CustomerForm from "../../features/Customers/Forms/CustomerForm";
import ServiceRequestDashboard from "../../features/ServiceRequests/ServiceRequestDashboard";
import ServiceRequestForm from "../../features/ServiceRequests/Forms/ServiceRequestForm";
import NotFound from "../../features/Errors/NotFound";
import ServerError from "../../features/Errors/ServerError";
import EstimateApptDashboard from "../../features/EstimateAppts/EstimateApptDashboard";
import EstimateApptForm from "../../features/EstimateAppts/Forms/EstimateApptForm";
import QuoteDashboard from "../../features/Quotes/QuoteDashboard";
import QuoteForm from "../../features/Quotes/Forms/QuoteForm";
import LoginForm from "../../features/Account/LoginForm";
import RequireAuth from "./RequireAuth";
import ReportsPage from "../../features/Reports/ReportsPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {element: <RequireAuth/>, children: [
                {path: 'mainDashboard', element: <MainDashboard/>},
            
                {path: 'customerDashboard', element: <CustomerDashboard/>},
                {path: 'customerDashboard/customerForm/:id', element: <CustomerForm/>},
                {path: 'customerDashboard/customerForm', element: <CustomerForm key='addNewCustomer'/>},

                {path: 'serviceRequestDashboard', element: <ServiceRequestDashboard/>},
                {path: 'serviceRequestDashboard/serviceRequestForm/:reqid', element: <ServiceRequestForm/>},
                {path: 'serviceRequestDashboard/serviceRequestForm/:custid/new', element: <ServiceRequestForm/>},
                {path: 'serviceRequestDashboard/serviceRequestForm', element: <ServiceRequestForm key='addNewServiceReq'/>},

                {path: 'estimateApptDashboard', element: <EstimateApptDashboard/>},
                {path: 'estimateApptDashboard/estimateApptForm/:apptId/:reqId', element: <EstimateApptForm/>},
                {path: 'estimateApptDashboard/estimateApptForm', element: <EstimateApptForm key='addNewEstimateAppt'/>},

                {path: 'quoteDashboard', element: <QuoteDashboard/>},
                {path: 'quoteDashboard/quoteForm/:quoteId/:reqId', element: <QuoteForm/>},
                {path: 'quoteDashboard/quoteForm', element: <QuoteForm key='addNewQuote'/>},

                {path: 'reports', element: <ReportsPage/>},
            ]},

            {path: '', element: <LoginForm/>},
            {path: 'login', element: <LoginForm />},
            
            
            {path: 'serverError', element: <ServerError />},
            { path: 'notFoundError', element: <NotFound /> },
            { path: '*', element: <Navigate replace to='/notFoundError' /> }



            
        ]
    }
])