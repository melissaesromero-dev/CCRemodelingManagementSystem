import { Box, Grid, Typography } from "@mui/material";
import ActiveQuotesRevenueCard from "./Components/ActiveQuotesRevenueCard";

export default function ReportsPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Reports
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>

          <ActiveQuotesRevenueCard />
        </Grid>
      </Grid>
    </Box>
  );
}
