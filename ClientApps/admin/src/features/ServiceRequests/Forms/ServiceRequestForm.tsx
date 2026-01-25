import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, Paper, Stack, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLookups, type SubType } from "../../../hooks/useLookUps";
import { useEffect, useMemo, useState } from "react";
import { useCustomers } from "../../../hooks/useCustomers";
import { useServiceRequests } from "../../../hooks/useServiceRequests";
import { Link as RouterLink, useLocation } from 'react-router';
import { useNavigate, useParams } from "react-router";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from "../../SharedComponents/ReusableTextInput";
import SelectInput from "../../SharedComponents/ReusableSelectInput";
import { serviceReqSchema, type ServiceReqSchema } from "../../../lib/schemas/serviceReqSchema";
import { Tooltip, Fade } from "@mui/material";
import DateTimeInput from "../../SharedComponents/ReusableDateTime";
import { useEstimateAppts } from "../../../hooks/useEstimateAppts";
import dayjs from "dayjs";

//BEGIN EXPORT DEFAULT FUNCTION
export default function ServiceRequestForm() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));  
  
    const navigate = useNavigate();  

    //Read where user came from and set back to url
    const location = useLocation();

    const navState = location.state as { from?: "serviceRequestDashboard" | "customerDashboard" | "quoteDashboard" | "estimateApptDashboard"} | null;

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
  
    const {custid, reqid} = useParams<{custid?: string; reqid?: string}>();
    
    const isEdit= !!reqid;
    const isNewForCustomer = !!custid && !reqid;
    
    //Only load ServiceRequest when editing
    const {serviceRequest,} = useServiceRequests(isEdit? reqid : undefined);

    const setServiceReq = serviceRequest as ServiceRequest;
    const newServiceReq = {} as ServiceRequest;
      
    const selectedServiceReq = setServiceReq ?? newServiceReq;
    
    
    const {deleteEstimateApptByReqId,
          estimateApptByReqId,
          updateEstimateAppt
    } = useEstimateAppts({reqId: isEdit? reqid : undefined});
    
    // Appointment complete/cancelled - do not allow changing Assigned Staff
    const estimateAppt = estimateApptByReqId ?? null;
    
    const isAssignedStaffLocked =
      estimateAppt != null && [2].includes(estimateAppt.statusId);

    // User is archived, lock service request and display Customer archived notice

    const {customer } = useCustomers(selectedServiceReq.customerId);
    const isRequestLocked = customer?.statusId ===2;
    const isRequestClosed = selectedServiceReq.statusId === 6;

    const {reset, handleSubmit, control, setValue, watch, clearErrors} = useForm<ServiceReqSchema>({
      mode: 'onTouched',
      resolver: zodResolver(serviceReqSchema),
      defaultValues: {
          customerId: isNewForCustomer ? String(custid) : '',
          userId: '',
          mainServiceTypeId: selectedServiceReq.mainServiceTypeId ? selectedServiceReq.mainServiceTypeId : undefined,
          subServiceTypeId: selectedServiceReq.subServiceTypeId ? selectedServiceReq.subServiceTypeId : undefined,
          serviceDesc: '',
          serviceAddress: '',
          serviceCity: '',
          serviceZip: '',   
          serviceStateId: selectedServiceReq.serviceStateId ? selectedServiceReq.serviceStateId : 38,       
          budgetRangeId: selectedServiceReq.budgetRangeId ? selectedServiceReq.budgetRangeId : undefined,
          desiredStartDate: undefined,      
          statusId: selectedServiceReq.statusId ? selectedServiceReq.statusId : 1,
        }
      });

    //Set existing service request
    useEffect(() => {
      if (serviceRequest) reset({
        ...serviceRequest,
        mainServiceTypeId: serviceRequest.mainServiceTypeId ?? undefined,
        subServiceTypeId: serviceRequest.subServiceTypeId ?? undefined
        });
    }, [serviceRequest, reset]);

    // Lookups
    const {customers} = useCustomers();
    const activeCustomers = customers?.filter(c => c.statusId === 1);
    const {allStaff, mainTypes, subTypes, budgetRanges, serviceReqStatuses, states} = useLookups();
    
    const [sameAs, setSameAs] = useState(false);
    const [paTooltip, setPaTooltip] = useState<string | null>(null);

    const originalStaffId = selectedServiceReq.userId
    ? selectedServiceReq.userId
    : null;

    
    //If user selects "undefined" for assigned staff, any estimate appointments scheduled will be permanenetly deleted, user needs to confirm. 
    const [showUnassignDialog, setShowUnassignDialog] = useState(false);
    const [pendingDto, setPendingDto] = useState<ServiceRequest | null>(null);

    const handleCancelUnassign = () => {
    setShowUnassignDialog(false);

    // restore previous staff assignment in the form
    if (originalStaffId) {
        setValue("userId", originalStaffId, { shouldDirty: false });
      } 
    else {
        setValue("userId", null, { shouldDirty: false });
      }

    };

  const handleConfirmUnassign = async () => {
    setShowUnassignDialog(false);

    // userId is already '' in the form – leave it that way
    if (selectedServiceReq.id) {
      await deleteEstimateApptByReqId.mutateAsync(selectedServiceReq.id);
    }

    if (pendingDto) {
      await saveServiceRequest(pendingDto);
      setPendingDto(null);
      navigate(backTo);
    }
  };

    const watchedCustomerId = watch('customerId');
    const watchedMainTypeId = watch('mainServiceTypeId');
    
    // compute the currently selected customer 
    const currentCustomer = useMemo(
      () => (customers ?? []).find(c => String(c.id) === String(watchedCustomerId)) ?? null,
      [customers, watchedCustomerId]
    );

    // --- helpers for same as customer address ---
    function applyCustomerAddress(cust?: Customer | null) {
      setValue('serviceAddress', cust?.address ?? '', { shouldDirty: true });
      setValue('serviceCity', cust?.city ?? '', { shouldDirty: true });
      setValue('serviceStateId', cust?.stateId ?? 38, { shouldDirty: true });
      setValue('serviceZip', cust?.zip ?? '', { shouldDirty: true });
    }

    function clearServiceAddress() {
      setValue('serviceAddress','', { shouldDirty: true });
      setValue('serviceCity', '', { shouldDirty: true });
      setValue('serviceStateId', 38, { shouldDirty: true });
      setValue('serviceZip', '', { shouldDirty: true });
    }

    function handleSameAsToggle(checked: boolean, cust?: Customer | null) {
      if (checked) {
        // If customer is not in PA, block copy + show error + tooltip
        if (cust && cust.stateId !== 38) {
          console.log('Blocking Same As: customer stateId =', cust.stateId);
          
          setSameAs(false); // keep the checkbox off
          clearServiceAddress(); // keep service address in PA/default

          const message = "Currently, we only service Pennsylvania. Service address must be in PA.";
          setPaTooltip(message);

          // auto-hide after 4 seconds
          setTimeout(() => {
            setPaTooltip(null);
          }, 4000);
              return;
        }

        if (!cust) {
          const message = "No customer is currently selected";
          setPaTooltip(message);

          // auto-hide after 4 seconds
          setTimeout(() => {
            setPaTooltip(null);
          }, 4000);
              return;
        }

        // OK to copy (customer is PA)
        setSameAs(true);
        applyCustomerAddress(cust);
        clearErrors('serviceStateId');
        setPaTooltip(null);
      } else {
        // unchecked, clear copy and error/tooltip
        setSameAs(false);
        clearServiceAddress();
        clearErrors('serviceStateId');
        setPaTooltip(null);
      }
    }

    // Set max date
    const today = new Date();
    today.setHours(0,0,0,0);

    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 2);
  
    // --- filter subTypes when a main type is chosen ---
    const filteredSubTypes = useMemo(() => {
      if (!watchedMainTypeId) return [];
      return (subTypes ?? []).filter(st => String(st.mainTypeId) === String(watchedMainTypeId));
      }, [watchedMainTypeId, subTypes]);

    
    // --- Add or Update Request
      const {updateServiceRequest, addNewServiceRequest} = useServiceRequests();
    
      const onSubmit = async (data: ServiceReqSchema) => {
          const dtoData = data;

          //zod acting weird and not picking up userid
          //const userId = watchedUserId;
    
        const dto: ServiceRequest = {
          ...(selectedServiceReq?.id ? {id: selectedServiceReq.id } : {}),
          reqNum: selectedServiceReq?.reqNum,
          customerId: String(dtoData.customerId ?? ""),
          userId: String(dtoData.userId ?? ""),
          mainServiceTypeId: dtoData.mainServiceTypeId ? Number(dtoData.mainServiceTypeId) : 0,
          subServiceTypeId: dtoData.subServiceTypeId ? Number(dtoData.subServiceTypeId) : 0,
          serviceDesc: String(dtoData.serviceDesc ?? ""),
          serviceAddress: String(dtoData.serviceAddress ?? ""),
          serviceCity: String(dtoData.serviceCity ?? ""),
          serviceStateId: dtoData.serviceStateId ? Number(dtoData.serviceStateId) : 0,
          serviceZip: String(dtoData.serviceZip ?? ""),
          budgetRangeId: dtoData.budgetRangeId ? Number(dtoData.budgetRangeId) : 0,
          //desiredStartDate: String(dtoData.desiredStartDate ?? undefined),
          desiredStartDate: dtoData.desiredStartDate
                ? dayjs(dtoData.desiredStartDate).toISOString()          // or .format('YYYY-MM-DDTHH:mm:ss')
                : null!,
          statusId: dtoData.statusId ? Number(dtoData.statusId) : 0,
          creationDate: new Date().toISOString().split('.')[0],
          custFullName: String(""),
          staffFullName: String(""),
          mainServiceTypeDesc: String(""),
          subServiceTypeDesc: String(""),
          estApptStatus: String(""),
          quoteNum: 0
        }

        // ----- ESTIMATE APPOINTMENT STATUS CHECK (ALWAYS RUN FIRST IF APPT EXISTS) -----
        const existingAppt =
          estimateAppt &&
          estimateAppt.id &&
          estimateAppt.serviceRequestId === selectedServiceReq.id
            ? estimateAppt
            : null;

        //Update estimate appointment status based on service request status change
        if (existingAppt && selectedServiceReq.id) {
          const isReqCancelled_Closed = dto.statusId === 6;
          const isReqCompleted = dto.statusId === 5;

          if (isReqCancelled_Closed && existingAppt.statusId !== 5) {
            await setApptStatus(existingAppt, "closed");
          } else if (!isReqCancelled_Closed && existingAppt.statusId === 5) {
            await setApptStatus(existingAppt, "cancelled");
          }

          if (isReqCompleted)
            await setApptStatus(existingAppt, "completed");
        }

        const hasExistingAppt = !!existingAppt;

        // ----- ASSIGNED STAFF UNASSIGN CHECK (RUN AFTER STATUS LOGIC) -----
        const isUnassigning =
          !!selectedServiceReq.id &&
          !dto.userId &&
          hasExistingAppt;

        if (isUnassigning) {
          setPendingDto(dto);
          setShowUnassignDialog(true);
          return; // wait for dialog confirm/cancel
        }

        // otherwise just save the request
        await saveServiceRequest(dto);
    
        //go back to customer dashboard
        navigate(backTo);
      }

  // helper that only saves the service request
  async function saveServiceRequest(dto: ServiceRequest) {
    if(dto.id){
      await updateServiceRequest.mutateAsync(dto as unknown as ServiceRequest);
   
    } else {
      await addNewServiceRequest.mutateAsync(dto as unknown as ServiceRequest);
    }
  }

  //If status request is changed to "Closed/Cancelled" the associated estimate appt status is changed to "Closed" also
  //******************* */
  //If status request is changed to something other than "Closed/Cancelled" and
  //  the associated estimate appt status is "closed" it will now be changed to "Cancelled" in order to be able to re-schedule
  //******************* */
  //If status request is changed to "Completed" the associatd estimate appt status is changed to "Completed"
  async function setApptStatus(estimateAppt: EstimateAppt, newStatus: string) {
    let setStatus = estimateAppt.statusId; 
    
    if(newStatus === "closed")
      setStatus = 5
    else if(newStatus === "cancel")
      setStatus = 3
    else if(newStatus === "completed")
      setStatus = 2

    try{
      estimateAppt.statusId = setStatus;
    await updateEstimateAppt.mutateAsync(estimateAppt as EstimateAppt);
    }
    catch(error){
      console.log(`Unable to update estimate appointment status: ${error}`)
    }    
  }

    // BEGIN RETURN
    return (
    <Paper elevation={1} 
           sx={{ mb:4, p: 5, 
                 border:1, 
                 width: {xs: '100%', md: '75%'},
                 mx: 'auto', 
                 borderColor: "lightgray" }}>
      <Typography color="primary" fontWeight={500} variant="h5" gutterBottom marginBottom={4}>        
        {selectedServiceReq.id ? "Edit Service Request" : "Add Service Request"}
        <Divider sx={{borderColor: "primary.main", height:3, bgcolor:"#06526D", borderRadius:4}}/>
      </Typography>

      {isRequestLocked ? (
        <Alert severity="warning" sx={{ mb: 5 }}>
          This service request is locked. Editing is disabled because the customer is currently archived.
        </Alert>
      ) : isRequestClosed ? (
        <Alert severity="warning" sx={{ mb: 5 }}>
          This service request is closed/cancelled.
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
            {/*Request ID */}
            {selectedServiceReq?.reqNum && (
            <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                fullWidth
                name="reqNum"
                label="Request Num"
                defaultValue={selectedServiceReq.reqNum}
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
            
            {/* Assigned Staff */}
            <Grid size={{ xs: 12, md:5 }}>
                <SelectInput 
                  items={allStaff ?? []} 
                  label="Assigned Staff" 
                  name="userId" 
                  allowEmpty
                  emptyLabel="Unassigned"
                  control={control}
                  getText={(u) => u.fullName }
                  getValue={(u) => u.id}
                  disabled={isAssignedStaffLocked || isRequestLocked || isRequestClosed} 
                />
            </Grid>

            {/* Customer */}
            {isRequestLocked 
            ? ( 
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                fullWidth
                label="Customer"
                defaultValue={customer?.fullName ?? "" }
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
            ) : ( <Grid size={{ xs: 12, md:4 }}>
              <SelectInput
                items={activeCustomers ?? []}
                label="Customer"
                name="customerId"
                control={control}
                getText={(c) => c.fullName}
                getValue={(c) => String(c.id)}
                disabled={isRequestLocked || isNewForCustomer || isRequestClosed}
                onChange={() => {
                  setSameAs(false);
                  clearServiceAddress();
                }}
              />
            </Grid> )}
            
        
            {/* Service Main Type */}
            <Grid size={{ xs: 12, md:6 }}>
              <SelectInput
                items={mainTypes ?? []}
                label="Service Main Type"
                name="mainServiceTypeId"
                control={control}
                getText={(mt) => mt.description}
                getValue={(mt) => mt.id}
                onChange={(e) => {
                  void e;
                  setValue('subServiceTypeId', 0, { shouldDirty: true });
                }}
                disabled={isRequestLocked || isRequestClosed}
              />
            </Grid>

            {/* Service Sub Type */}
            <Grid size={{ xs: 12, md:6 }}>
              <SelectInput<ServiceReqSchema, SubType>
                items={filteredSubTypes}
                label="Service Sub Type"
                name="subServiceTypeId"
                control={control}
                getText={(st) => st.description}
                getValue={(st) => st.id}
                disabled={!watchedMainTypeId || isRequestLocked || isRequestClosed}
              />
            </Grid>

            {/* Desired Date */}
            <Grid size={{xs:12, md:4}}>
                <DateTimeInput
                name="desiredStartDate"
                control={control}
                label="Desired Start Date"
                views={['year', 'month', 'day']}
                disablePast
                maxDate={maxDate}
                readOnly={isRequestLocked || isRequestClosed}
                disabled = {isRequestLocked || isRequestClosed}
                />
            </Grid>

            {/* Budget Range */}
            <Grid size={{ xs: 12, md:4 }}>
                <SelectInput 
                  items={budgetRanges ?? []} 
                  label="Budget Range" 
                  name="budgetRangeId" 
                  control={control}
                  getText={(b) => b.description }
                  getValue={(b) => b.id}
                  disabled={isRequestLocked || isRequestClosed}
                />
                
            </Grid>

            {/* Request Status */}
            <Grid size={{ xs: 12, md:4 }}>
                <SelectInput 
                  items={serviceReqStatuses ?? []} 
                  label="Status" 
                  name="statusId" 
                  control={control}
                  getText={(s) => {
                    const x = s.description ?? '';
                    return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase();
                  }}
                  getValue={(s) => s.id}
                  disabled={isRequestLocked}
                />

            </Grid>
            
            {/* Service Description */}
            <Grid size={12}>
                <TextInput 
                  label="Service Description" 
                  multiline
                  minRows={4}
                  maxRows={8}
                  control={control} 
                  name="serviceDesc"
                  disabled={isRequestLocked || isRequestClosed}
                   />
                
            </Grid>

            {/* Service Address */}
            <Grid size={12}>
                <Typography>Service Address</Typography>
                <Tooltip
                  title={paTooltip ?? ""}
                  open={Boolean(paTooltip)}
                  disableHoverListener={Boolean(paTooltip)} // when showing error, ignore hover
                  disableFocusListener={Boolean(paTooltip)}
                  disableTouchListener={Boolean(paTooltip)}
                  placement={isMobile ? "bottom-start" : "right"}
                  slots={{ transition: Fade }}
                  slotProps={{ 
                    transition: { timeout : { enter: 150, exit: 800}},
                    popper: {
                    modifiers: [
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "viewport",
                          padding: 8,
                        },
                      },
                      {
                        name: "flip",
                        options: {
                          fallbackPlacements: ["bottom-start", "bottom", "top"],
                        },
                      },
                    ],
                  },
                  tooltip: {
                    sx: {
                      maxWidth: 260,
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      },
                    },
                  }}
                >  
               <span>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={sameAs}
                          onChange={(e) =>
                            handleSameAsToggle(e.target.checked, currentCustomer)
                          }
                          disabled={isRequestLocked || isRequestClosed}
                        />
                      }
                      label="Same As Customer"
                    />
                  </span>
                </Tooltip>
            </Grid>
            <Grid size={{xs:12}}>
                <TextInput
                  label="Address"
                  control={control}
                  name="serviceAddress"
                  disabled={isRequestLocked || isRequestClosed}                  
                />
                
            </Grid>

            {/* City / State / Zip */}
            
            <Grid size={{xs:12, md:5}}>
                <TextInput
                  label="City"
                  control={control}
                  name="serviceCity"
                  disabled={isRequestLocked || isRequestClosed}
                />
                
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <SelectInput 
                  items={states.filter(s => s.id === 38)} 
                  label="State" 
                  name="serviceStateId" 
                  control={control}
                  getText={(s) => s.shortName}
                  getValue={(s) => s.id}
                  disabled={isRequestLocked || isRequestClosed}
                />
                

            </Grid>

            <Grid size={{xs:12, md:4}}>
              <TextInput 
                label="Zip" 
                control={control} 
                name="serviceZip"
                slotProps={{
                  inputLabel: { shrink: selectedServiceReq?.serviceZip ? true : undefined},
                  input: {
                    inputProps: { 
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 10,
                    },
                    
                  }
                }} 
                disabled={isRequestLocked || isRequestClosed}
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
                  disabled={updateServiceRequest.isPending || addNewServiceRequest.isPending || isRequestLocked } >
            Save
          </Button>
        </Stack>
      </Box>

      <Dialog
        open={showUnassignDialog}
        onClose={handleCancelUnassign}
      >
        <DialogTitle>Remove assigned staff?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This service request currently has one or more appointments scheduled for the assigned staff. If you set Assigned Staff for 
            this request to “Unassigned”, the appointment linked to this request will be permanently deleted.
            <br />
            <br />
            Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUnassign} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmUnassign} color="error" variant="contained">
            Unassign &amp; delete appointments
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
