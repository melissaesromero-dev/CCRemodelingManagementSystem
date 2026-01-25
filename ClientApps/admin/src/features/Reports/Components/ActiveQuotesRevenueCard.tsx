import { Card, CardContent, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import agent from "../../../lib/api/agent";

type ActiveQuotesRevenueSummaryDto = {
  activeQuoteCount: number;
  totalPotentialIncome: number;
};

export default function ActiveQuotesRevenueCard() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["reports", "active-quotes-revenue"],
    queryFn: async (): Promise<ActiveQuotesRevenueSummaryDto> => {
      const res = await agent.get("/reports/active-quotes-revenue");
      return res.data.value ?? res.data; 
    },
  });

  const money = (n?: number) =>
    (n ?? 0).toLocaleString(undefined, { style: "currency", currency: "USD" });

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Active Quotes Revenue Summary</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Total potential income from all active quotes.
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        {isPending && (
          <Stack spacing={1}>
            <Skeleton height={26} />
            <Skeleton height={26} />
          </Stack>
        )}

        {isError && (
          <Typography color="error">
            Could not load report. Please try again.
          </Typography>
        )}

        {!isPending && !isError && data && (
          <Stack spacing={1}>
            <Typography variant="body1">
              <strong>Active Quotes:</strong> {data.activeQuoteCount.toLocaleString()}
            </Typography>
            <Typography variant="body1">
              <strong>Total Potential Income:</strong> {money(data.totalPotentialIncome)}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
