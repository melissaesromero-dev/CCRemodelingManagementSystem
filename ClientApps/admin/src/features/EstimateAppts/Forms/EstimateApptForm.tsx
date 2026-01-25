import { Typography, Paper, Divider, Box, Grid, Stack, Button, TextField } from "@mui/material";
import SelectInput from "../../SharedComponents/ReusableSelectInput";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEstimateAppts } from "../../../hooks/useEstimateAppts";
import { estimateApptSchema, type EstimateApptSchema } from "../../../lib/schemas/estimateApptSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServiceRequests } from "../../../hooks/useServiceRequests";
import { useEffect, useMemo } from "react";
import DateTimeInput from "../../SharedComponents/ReusableDateTime";
import dayjs from 'dayjs';
import { useLookups } from "../../../hooks/useLookUps";
import { Link as RouterLink } from 'react-router';
import TextInput from "../../SharedComponents/ReusableTextInput";


//BEGIN EXPORT DEFAULT FUNCTION
export default function EstimateApptForm() {
    
  const navigate = useNavigate();

  //Read where user came from and set back to url
      const location = useLocation();
  
      const navState = location.state as { from?: "serviceRequestDashboard" | "customerDashboard" | "quoteDashboard" | "estimateApptDashboard"} | null;

      console.log(navState?.from)

      let backTo = "/serviceRequestDashboard";
        switch (navState?.from) {
        case "customerDashboard":
          backTo = "/customerDashboard";
          break;
        case "quoteDashboard":
          backTo = "/quoteDashboard";
          break;
        case "estimateApptDashboard":
          backTo = "/estimateApptDashboard";
          break;
      }

  console.log(backTo);
  
  const {apptId, reqId} = useParams<{
    apptId?: string;
    reqId?: string;}>();

  const {estimateAppt, isEdit, isPureNew} = useEstimateAppts({Id: apptId, reqId});
  
  const setEstimateAppt = estimateAppt as EstimateAppt;
  const newEstimateAppt = {} as EstimateAppt;

  const selectedEstimateAppt = setEstimateAppt ?? newEstimateAppt;
  
  const {reset, handleSubmit, control, setValue, watch} = useForm<EstimateApptSchema>({
    mode: 'onTouched',
    resolver: zodResolver(estimateApptSchema),
    defaultValues: {
      scheduledDate: 
        selectedEstimateAppt.scheduledDate 
        ? selectedEstimateAppt.scheduledDate 
        : '',

      scheduledTime: 
        selectedEstimateAppt.scheduledTime
        ? selectedEstimateAppt.scheduledTime
        : '',
      
      statusId: 
        selectedEstimateAppt.statusId 
        ? selectedEstimateAppt.statusId 
        : 1,

      serviceRequestId: 
        selectedEstimateAppt.serviceRequestId
        ? selectedEstimateAppt.serviceRequestId
        : '',

      notes:
        selectedEstimateAppt.notes
        ? selectedEstimateAppt.notes
        : '',
    }
  });

  useEffect(() => {
        if (estimateAppt) reset({
          ...estimateAppt,
          notes: estimateAppt.notes ?? "",

          scheduledDate: estimateAppt.scheduledDate ?? "",
          
          scheduledTime: estimateAppt?.scheduledTime != null 
            ? dayjs(estimateAppt.scheduledTime as string, [
              'HH:mm',
              'HH:mm:ss',
              'h:mm A'
            ]).format('HH:mm:ss')
          : "",

          statusId: 
            estimateAppt.statusId && estimateAppt.statusId > 0
            ? estimateAppt.statusId
            : 1,
        });
      }, [estimateAppt, reset]);
    

  //Get all Service Requests and all appointments
  const { serviceRequests } = useServiceRequests();
  const { estimateAppts } = useEstimateAppts();

  
    // Set max date
    const today = new Date();
    today.setHours(0,0,0,0);

    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 2);

    //Set time slots
    const timeSlots = useMemo(
    () =>
        Array.from({ length: ((19 - 8) * 60) / 30 + 1 }, (_, index) => {
        const minutesFromStart = index * 30;
        const time = dayjs().hour(8).minute(0).second(0).millisecond(0).add(minutesFromStart, 'minute');

        return {
            label: time.format('h:mm A'),      // 8:00 AM, 8:30 AM, ...
            value: time.format('HH:mm:ss'),      // 08:00, 08:30, ... for API/DB
        };
        }),
    []
    );

    

    //Set Flags
    const canSelectSR = isPureNew;

    const watchedStatusId = watch('statusId');
    const statusIdNumber = Number(watchedStatusId ?? 0); 
    
    const isComplete = statusIdNumber === 2;
    const isClosed = statusIdNumber === 5;

    // Lookups
    const {estApptStatuses} = useLookups();

    //Set current Service Request for read only case
  const currentServiceRequestId =
  reqId ?? selectedEstimateAppt.serviceRequestId ?? '';

  const currentServiceRequest = useMemo(
    () =>
        (serviceRequests ?? []).find(sr => sr.id === currentServiceRequestId) ??
        null,
    [serviceRequests, currentServiceRequestId]
    );

  const availableServiceRequests = useMemo(() => {
    if (!canSelectSR) return [];

    const usedIds = new Set(
        (estimateAppts ?? []).map(ea => ea.serviceRequestId)
    );

    return (serviceRequests ?? []).filter(sr => 
      sr.userId != null 
      && !usedIds.has(sr.id!));
    }, [canSelectSR, serviceRequests, estimateAppts]);

    useEffect(() => {
        if (currentServiceRequestId) {
            setValue('serviceRequestId', currentServiceRequestId, { shouldDirty: false });
        }
        }, [currentServiceRequestId, setValue]);

    
        
    //Add or Update Estimate Appointment
      const {updateEstimateAppt, addNewEstimateAppt} = useEstimateAppts();
    
      const onSubmit = async (data: EstimateApptSchema) => {
        const dtoData = data;
        //Zod acting querky and dropping some values in data, so these must be grabbed from watch
        const time = watch("scheduledTime");
        const statusId = watch("statusId");

        console.log("dtoData statusID: ", dtoData.statusId)

        const dto = {
          ...(selectedEstimateAppt?.id ? {id: selectedEstimateAppt.id } : {}),
          estApptNum: selectedEstimateAppt.estApptNum ?? 0,
          serviceRequestId : String(dtoData.serviceRequestId ?? ""),
          statusId:  statusId,
          scheduledDate: dtoData.scheduledDate,
          scheduledTime: time,
          notes: dtoData.notes ?? "",
        }

        console.log("dto statusID: ", dto.statusId)

        if(dto.id){
          await updateEstimateAppt.mutateAsync(dto as unknown as EstimateAppt);
        } else {
          await addNewEstimateAppt.mutateAsync(dto as unknown as EstimateAppt);
        }
    
        //go back to customer dashboard
        navigate(backTo);
      }


    if (!selectedEstimateAppt) return <Typography>Estimate appointment Not Found</Typography>
  
// BEGIN RETURN
return (
    <Paper elevation={1} 
           sx={{ mb:4, p: 5, 
                 border:1, 
                 width: {xs: '100%', md: '65%'},
                 mx: 'auto', 
                 borderColor: "lightgray" }}>
      <Typography color="primary" fontWeight={500} variant="h5" gutterBottom marginBottom={4}>
        {isEdit ? "Edit Estimate Appointment" : "Add Estimate Appointment"}
        <Divider sx={{borderColor: "primary.main", height:3, bgcolor:"#06526D", borderRadius:4}}/>
      </Typography>

      {canSelectSR && availableServiceRequests.length == 0 ? (
        <>
          <Stack direction="row" spacing={2} sx={{ mt: 6 }}>
          <Typography>There are no current service requests without an appointment. Appointments can only be scheduled for open service requests that do not already have something scheduled. You can add a new service request and then schedule the estimate appointment.</Typography> 
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 6 }}>
            <Button component={RouterLink} 
                    to={"/serviceRequestDashboard/serviceRequestForm"}
                    variant="contained" 
                  >
              Open New Request
            </Button>

            <Button component={RouterLink}
                  to={"/estimateApptDashboard"} 
                  variant="contained" color="inherit" 
            >
              Cancel
            </Button>
            
          </Stack>
        </>
        
      ) :
      (

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        
        <Grid container spacing={3}>
            {/*Estimate Appt Num */}
            {selectedEstimateAppt?.estApptNum && (
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth
                        name="estApptNum"
                        label="Appt-Num"
                        defaultValue={selectedEstimateAppt.estApptNum}
                        slotProps={{
                            input: { readOnly: true },
                            inputLabel: { shrink: true },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: 'none' },
                            '&:hover fieldset': { border: 'none' },
                            '&.Mui-focused fieldset': { border: 'none' },
                            },
                        }}
                    />
                </Grid>
            )}

            {/* Service Request / Req-Num */}
            {canSelectSR ? (
            // PURE NEW: user can pick from SRs that have NO appointment yet
            <Grid size={{ xs: 12, md: 5 }}>
                <SelectInput
                items={availableServiceRequests}
                label="Service Request"
                name="serviceRequestId"
                control={control}
                getText={(sr) => `Req-${sr.reqNum}`}
                getValue={(sr) => sr.id!}/>
            </Grid>
            ) : (
            // EDIT or NEW-FOR-SPECIFIC-REQUEST: SR is fixed → show read-only
            <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                fullWidth
                name="serviceReqNum"
                label="Req-Num"
                value={
                    currentServiceRequest?.reqNum ??
                    selectedEstimateAppt.requestNumber ??
                    ''
                }
                slotProps={{
                    input: { readOnly: true },
                    inputLabel: { shrink: true },
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                    },
                }}
                />
            </Grid>
            )}
            {/* force new row */}
            <Grid size={{ xs: 12 }} />
            {/* Service Date */}
            <Grid size={{xs:12, md:6}}>
                <DateTimeInput
                    name="scheduledDate"
                    control={control}
                    label="Date"
                    views={['year', 'month', 'day']}
                    disablePast
                    maxDate={maxDate}
                    disabled={isComplete || isClosed} 
                />
            </Grid>

            {/* Service Time */}
            <Grid size={{ xs: 12, md: 6 }}>
            <SelectInput
                items={timeSlots}
                label="Time"
                name="scheduledTime"
                control={control}
                getText={(slot) => slot.label}
                getValue={(slot) => slot.value}
                disabled={isComplete || isClosed}
            />
            </Grid>

            {/* Appointment Status */}
            <Grid size={{ xs: 12, md:6 }}>
                <SelectInput 
                    items={estApptStatuses ?? []} 
                    label="Status" 
                    name="statusId" 
                    control={control}
                    getText={(eas) => {
                        const x = eas.description ?? '';
                        return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase();
                    }}
                    getValue={(eas) => eas.id}
                    disabled={isComplete || isClosed}
                    
                />
            </Grid>
            
            {/* Appointment Notes */}
            <Grid size={{ xs: 12, md:12 }}>
                <TextInput 
                  label="Notes" 
                  multiline
                  minRows={4}
                  maxRows={8}
                  control={control} 
                  name="notes"
                  disabled={isClosed}
                   />
                
            </Grid>
        </Grid>

        {/* Actions: centered */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 6 }}>
          <Button component={RouterLink}
                  to={backTo} 
                  variant="contained" color="inherit" 
          >
            Cancel
          </Button>
          <Button variant="contained" 
                  type="submit"
                  disabled={updateEstimateAppt.isPending || addNewEstimateAppt.isPending}>
            Save
          </Button>
        </Stack>
      </Box>
      )}
    </Paper>
  );
}

