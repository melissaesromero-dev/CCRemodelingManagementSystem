import { Person, Assignment, AttachMoney, Event } from "@mui/icons-material";
import { Box, Card, CardActionArea, CardContent, Container, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { cardSx, countSx, headerRowSx, titleSx } from "../../app/layout/Themes/theme";
import { useCustomers } from "../../hooks/useCustomers";
import { useQuotes } from "../../hooks/useQuotes";
import { useServiceRequests } from "../../hooks/useServiceRequests";
import { useEstimateAppts } from "../../hooks/useEstimateAppts";
import { Link as RouterLink} from "react-router";
import { useAccount } from "../../hooks/useAccount";

//START EXPORT FUNCTION
export default function MainDashboard() {
  const {customers} = useCustomers();
  const {serviceRequests} = useServiceRequests();
  const {estimateAppts} = useEstimateAppts();
  const {quotes} = useQuotes();
  const {currentUser } = useAccount();

  
  //total customers
  const custTotal = customers?.length ?? 0;

  //total new service requests
  const newSRTotal = serviceRequests?.filter(sr => sr.statusId === 1).length ?? 0;

  //total open service requests
  const openSRTotal = serviceRequests?.filter(sr => sr.statusId !== 5 && sr.statusId !== 6).length ?? 0;

  //total estimate appts
  const estApptsTotal = estimateAppts?.length ?? 0;

  //total quotes
  const quotesTotal = quotes?.length ?? 0;

    //START RETURN
    return (
    <>
        <Typography variant="h5">
            Dashboard - Welcome {currentUser ? currentUser.firstName : ""}!
        </Typography>
        <Container maxWidth="lg" sx={{mt: 3, mb: 0, minHeight:"70vh", display: "flex", flexDirection: "column" }}>
            <Grid container spacing={2}>
                {/*Customers Card*/}
                <Grid size={{ xs: 6 }}>
                    <Card sx={{...cardSx, flex: 1, display: 'flex', flexDirection:'column'}}>
                        <CardActionArea component={RouterLink} to="/customerDashboard"  sx={{ flex: 1, display: 'flex' }}>
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={headerRowSx}>
                                <Person fontSize="small" />
                                <Typography variant="h6" sx={titleSx}>
                                    CUSTOMERS
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{...countSx, mb:3, mt:2}}>
                                {custTotal}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                {/*Service Requests Card*/}
                <Grid size={{ xs: 6}}>
                    <Card sx={{...cardSx, flex: 1, display: 'flex', flexDirection:'column'}}>
                        <CardActionArea component={RouterLink} to="/serviceRequestDashboard"
                        sx={{ flex: 1, display: 'flex' }}>
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={headerRowSx}>
                                <Assignment fontSize="medium" />
                                <Typography variant="h6" sx={titleSx}>
                                    SERVICE REQUESTS
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, pb:0 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography sx={{lineHeight: 1, mt:1.5}}>New:</Typography>
                                    <Typography variant="h4" sx={{...countSx, lineHeight: 1}}>
                                        {newSRTotal}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography sx={{lineHeight: 1, mt:1.5}}>Open:</Typography>
                                    <Typography variant="h4" sx={{...countSx, lineHeight:1}}>
                                        {openSRTotal}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                
                {/*Estimate Appointments*/}
                <Grid size={{ xs: 6 }}>
                    <Card component={RouterLink} 
                        to="/estimateApptDashboard"
                        sx={{
                            ...cardSx, 
                            flex: 1, 
                            display: 'flex', 
                            flexDirection:'column',
                            textDecoration: 'none',
                            "&:hover": { textDecoration: "none" }}}>
                        <CardActionArea sx={{ flex: 1, display: 'flex' }}>
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={headerRowSx}>
                                <Event fontSize="medium" />
                                <Typography variant="h6" sx={titleSx}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;ESTIMATE<br/>
                                    APPOINTMENTS
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={countSx}>
                                {estApptsTotal}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                {/*Quotes*/}
                <Grid size={{ xs: 6}}>
                    <Card component={RouterLink} 
                        to="/quoteDashboard"
                        sx={{
                            ...cardSx, 
                            flex: 1, 
                            display: 'flex', 
                            flexDirection:'column',
                            textDecoration: 'none'}}>
                        <CardActionArea sx={{ flex: 1, display: 'flex' }}>
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={headerRowSx}>
                                <AttachMoney fontSize="medium" />
                                <Typography variant="h6" sx={titleSx}>
                                    QUOTES
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mt:2, gap: 1 }}>
                                    <Typography sx={{lineHeight: 1, mt:1.5}}>Active:</Typography>
                                    <Typography variant="h4" sx={{...countSx, lineHeight: 1}}>
                                        {quotesTotal}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </Container>

    </>
  )
}