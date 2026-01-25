// src/components/quotes/forms/QuoteForm.tsx
import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Divider,
  TextField,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { useQuotes } from "../../../hooks/useQuotes";
import { useLookups } from "../../../hooks/useLookUps";
import { useParams, useNavigate, useLocation } from "react-router";
import { Link as RouterLink } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from "../../SharedComponents/ReusableTextInput";
import SelectInput from "../../SharedComponents/ReusableSelectInput";
import { quoteSchema, type QuoteSchema } from "../../../lib/schemas/quoteSchema";
import { useEffect, useMemo } from "react";
import { useServiceRequests } from "../../../hooks/useServiceRequests";


//BEGIN EXPORT DEFAULT FUNCTION
export default function QuoteForm() {
  
  const navigate = useNavigate();
  
  const {quoteId, reqId} = useParams<{
    quoteId?: string;
    reqId?: string;}>();

  //Read where user came from and set back to url
  const location = useLocation();


  const navState = location.state as { from?: "serviceRequestDashboard" | "customerDashboard" | "quoteDashboard" } | null;

  let backTo = "/quoteDashboard";
  switch (navState?.from) {
    case "serviceRequestDashboard":
      backTo = "/serviceRequestDashboard";
      break;
    case "customerDashboard":
      backTo = "/customerDashboard";
      break;
    case "quoteDashboard":
      backTo = "/quoteDashboard";
      break;
  }
    
  //Detect new-for-specific-request
  const isNewForSpecificRequest = quoteId === "new";
  const currentQuoteId = quoteId && quoteId !== "new" ? quoteId : undefined;
  
  //Get single quote (if editing)
  const {
    quote,
    quotes,
    updateQuote,
    addNewQuote,} = useQuotes({id: currentQuoteId});
  
  // Get all service requests for dropdown / read-only display
  const { serviceRequests } = useServiceRequests();
    
  const setQuote = quote as Quote;
  const newQuote = {} as Quote;

  const selectedQuote = setQuote ?? newQuote;
  
  const {reset, handleSubmit, control, watch, setValue} = useForm<QuoteSchema>({
    mode: 'onTouched',
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      statusId: 
        selectedQuote.statusId 
        ? selectedQuote.statusId 
        : 1,
      
      laborDetails:
        selectedQuote.laborDetails
        ? selectedQuote.laborDetails
        : '',

      materialDetails:
        selectedQuote.materialDetails
        ? selectedQuote.materialDetails
        : '',

      laborCostEstimate: 
        selectedQuote.laborCostEstimate 
        ? selectedQuote.laborCostEstimate 
        : 0,

      materialCostEstimate: 
        selectedQuote.materialCostEstimate 
        ? selectedQuote.materialCostEstimate 
        : 0,

      serviceRequestId: selectedQuote.serviceRequestId
          ? selectedQuote.serviceRequestId
          : '',
    }
  });

  const laborCostEstimate = watch("laborCostEstimate") ?? 0;
  const materialCostEstimate = watch("materialCostEstimate") ?? 0;

  const totalCostEstimate = (Number(laborCostEstimate) || 0) + (Number(materialCostEstimate) || 0);

  // Flags
  const hasReqId = !!reqId;
  const isEdit = !!quoteId;
  const isPureNew = !isEdit && !hasReqId && !isNewForSpecificRequest;
  const canSelectSR = isPureNew;

  useEffect(() => {
    if (quote) {
        reset({
            ...quote,
            statusId: quote.statusId ?? 1,
            laborDetails: quote.laborDetails ?? '',
            materialDetails: quote.materialDetails ?? '',
            laborCostEstimate: quote.laborCostEstimate ?? 0,
            materialCostEstimate: quote.materialCostEstimate ?? 0,
            serviceRequestId: quote.serviceRequestId ?? "",
        });
    }
  }, [quote, reset]);

  // Determine the current Service Request (for read-only case)
  const currentServiceRequestId =
    reqId ?? selectedQuote.serviceRequestId ?? "";

  const currentServiceRequest = useMemo(
    () =>
      (serviceRequests ?? []).find(
        (sr) => sr.id === currentServiceRequestId
      ) ?? null,
    [serviceRequests, currentServiceRequestId]
  );

  // Service Requests that do NOT already have a quote
  const availableServiceRequests = useMemo(() => {
    if (!canSelectSR) return [];

    const usedIds = new Set(
      (quotes ?? []).map((q) => q.serviceRequestId)
    );

    return (serviceRequests ?? []).filter(
      (sr) =>
        sr.userId != null &&
        !usedIds.has(sr.id!)
    );
  }, [canSelectSR, serviceRequests, quotes]);

  // Keep form's serviceRequestId in sync with route / existing data
  useEffect(() => {
    if (currentServiceRequestId) {
      setValue("serviceRequestId", currentServiceRequestId, {
        shouldDirty: false,
      });
    }
  }, [currentServiceRequestId, setValue]);

  //Add or Update Quote
  
  const onSubmit = async (data: QuoteSchema) => {
    const dtoData = data;
    
    const dto = {
        ...(selectedQuote?.id ? {id: selectedQuote.id } : {}),
        quoteNum: selectedQuote.quoteNum ?? 0,
        serviceRequestId : String(dtoData.serviceRequestId ?? ""),
        statusId:  dtoData.statusId,
        laborDetails: dtoData.laborDetails ?? "",
        materialDetails: dtoData.materialDetails ?? "",
        laborCostEstimate: dtoData.laborCostEstimate,
        materialCostEstimate: dtoData.materialCostEstimate,
    };

    if(dto.id){
      console.log(dto);
      await updateQuote.mutateAsync(dto as unknown as Quote);
    } else {
      console.log(dto);
      await addNewQuote.mutateAsync(dto as unknown as Quote);
    }

    //go back to quote dashboard
    console.log(backTo);
    navigate(backTo);
  };  

  
  //Set look-ups
  const {quoteStatuses} = useLookups();

  
  // BEGIN RETURN
  
  if (!selectedQuote) return <Typography>Quote Not Found</Typography>

  return (
    <Paper elevation={1} 
           sx={{ mb:4, p: 5, 
                 border:1, 
                 width: {xs: '100%', md: '60%'},
                 mx: 'auto', 
                 borderColor: 'lightgray' }}>
      <Typography color="primary" fontWeight={500} variant="h5" gutterBottom marginBottom={4}>
        {selectedQuote.id ? "Edit Quote" : "Create Quote"}
        <Divider sx={{borderColor: "primary.main", height:3, bgcolor:"#06526D", borderRadius:4}}/>
      </Typography>

      {canSelectSR && availableServiceRequests.length === 0 ? (
        <>
          <Stack direction="row" spacing={2} sx={{ mt: 6 }}>
            <Typography>
              There are no current service requests without a quote.
              Quotes can only be created for open service requests that
              do not already have a quote. You can add a new service
              request and then create a quote.
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 6 }}
          >
            <Button
              component={RouterLink}
              to={"/serviceRequestDashboard/serviceRequestForm"}
              variant="contained"
            >
              Open New Request
            </Button>

            <Button
              component={RouterLink}
              to={"/quoteDashboard"}
              variant="contained"
              color="inherit"
            >
              Cancel
            </Button>
          </Stack>
        </>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Quote Num */}
            {selectedQuote?.quoteNum && (
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  name="quoteNum"
                  label="Quote Num"
                  defaultValue={selectedQuote.quoteNum}
                  slotProps={{
                    input: { readOnly: true },
                    inputLabel: { shrink: true },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { border: "none" },
                      "&:hover fieldset": { border: "none" },
                      "&.Mui-focused fieldset": { border: "none" },
                    },
                  }}
                />
              </Grid>
            )}

            {/* Service Request / Req-Num */}
            {canSelectSR ? (
              // PURE NEW: user can pick from SRs that have NO quote yet
              <Grid size={{ xs: 12, md: 5 }}>
                <SelectInput
                  items={availableServiceRequests}
                  label="Service Request"
                  name="serviceRequestId"
                  control={control}
                  getText={(sr) => `Req-${sr.reqNum}`}
                  getValue={(sr) => sr.id!}
                />
              </Grid>
            ) : (
              // EDIT or NEW-FOR-SPECIFIC-REQUEST: SR is fixed - show read-only
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  name="serviceReqNum"
                  label="Req-Num"
                  value={
                    currentServiceRequest?.reqNum ??
                    selectedQuote.requestNumber ??
                    ""
                  }
                  slotProps={{
                    input: { readOnly: true },
                    inputLabel: { shrink: true },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { border: "none" },
                      "&:hover fieldset": { border: "none" },
                      "&.Mui-focused fieldset": { border: "none" },
                    },
                  }}
                />
              </Grid>
            )}

            {/* Status */}
            <Grid size={{ xs: 12, md: 4 }}>
              <SelectInput
                items={quoteStatuses ?? []}
                label="Status"
                name="statusId"
                control={control}
                getText={(qs) => qs.description}
                getValue={(qs) => String(qs.id)}
              />
            </Grid>

            {/* Labor Details */}
            <Grid size={{ xs: 12, md: 12 }}>
              <TextInput
                label="Labor Details"
                multiline
                minRows={4}
                maxRows={8}
                control={control}
                name="laborDetails"
              />
            </Grid>


            {/* Labor Cost Estimate */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                label="Labor Cost Estimate"
                control={control}
                name="laborCostEstimate"
                slotProps={{
                  inputLabel: {
                    shrink: selectedQuote?.laborCostEstimate
                      ? true
                      : undefined,
                  },
                }}
              />
            </Grid>

            
            {/* Material Details */}
            <Grid size={{ xs: 12, md: 12 }}>
              <TextInput
                label="Material Details"
                multiline
                minRows={4}
                maxRows={8}
                control={control}
                name="materialDetails"
              />
            </Grid>

            {/* Material Cost Estimate */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                label="Material Cost Estimate"
                control={control}
                name="materialCostEstimate"
                slotProps={{
                  inputLabel: {
                    shrink: selectedQuote?.materialCostEstimate
                      ? true
                      : undefined,
                  },
                }}
              />
            </Grid>

            {/* Total Cost Estimate */}
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ ml: 2, mb: 1 }} variant="body2">
                Total Cost Estimate
              </Typography>
              <Typography sx={{ ml: 2 }}>
                $
                {totalCostEstimate.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Typography>
            </Grid>
          </Grid>

          {/* Actions: centered */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 6 }}
          >
            <Button
              variant="contained"
              color="inherit"
              onClick={() => navigate(backTo)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={updateQuote.isPending || addNewQuote.isPending}
            >
              Save
            </Button>
          </Stack>
        </Box>
      )}      
    </Paper>
  );
}


