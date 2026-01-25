// src/components/customers/forms/CustomerForm.tsx
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Stack,
  Button,
  Paper,
  FormGroup,
  Divider,
  Alert,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { useEffect, useState, } from "react";
import { useCustomers } from "../../../hooks/useCustomers";
import { useLookups } from "../../../hooks/useLookUps";
import { useParams, useNavigate } from "react-router";
import { Link as RouterLink } from 'react-router';
import { useForm } from 'react-hook-form';
import { customerSchema, type CustomerSchema } from "../../../lib/schemas/customerSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from "../../SharedComponents/ReusableTextInput";
import SelectInput from "../../SharedComponents/ReusableSelectInput";

type Props = {
  onChange?: (patch: Partial<Customer>) => void;
};

//BEGIN EXPORT DEFAULT FUNCTION
export default function CustomerForm({onChange}: Props) {
  
  const navigate = useNavigate();
  
  const {id} = useParams();
  const {customer, requestAndApptsCountByCustomer} = useCustomers(id);
  
  const setCustomer = customer as Customer;
  const newCustomer = {} as Customer;

  const selectedCustomer = setCustomer ?? newCustomer;
  
  const {reset, handleSubmit, control, register, setValue} = useForm<CustomerSchema>({
    mode: 'onTouched',
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zip: '',          
      stateId: selectedCustomer.stateId ? selectedCustomer.stateId : 38,       
      methodId: selectedCustomer.contactMethod ? selectedCustomer.contactMethod: 0,      
      bestTimeId: selectedCustomer.bestTime ? selectedCustomer.bestTime : 0,
    }

  });

  //Add or Update Customer
  const {updateCustomer, addNewCustomer} = useCustomers();

  useEffect(() => {
    if (customer) reset({
      ...customer,
      zip: customer.zip ?? '',
      methodId: customer.contactMethod ?? 0,
      bestTimeId: customer.bestTime ?? 0,
      stateId: customer.stateId ?? 0});
  }, [customer, reset]);

  const onSubmit = async (data: CustomerSchema) => {
    const dtoData = data;
    
    const dto = {
      ...(selectedCustomer?.id ? {id: selectedCustomer.id } : {}),
      custNum: selectedCustomer.custNum ? selectedCustomer.custNum : "0",
      firstName: String(dtoData.firstName ?? ""),
      lastName:  String(dtoData.lastName ?? ""),
      email:     String(dtoData.email ?? ""),
      phone:     String(dtoData.phone ?? ""),
      address:   String(dtoData.address ?? ""),
      city:      String(dtoData.city ?? ""),
      zip:       String(dtoData.zip ?? ""),
      // convert to numbers for int/enum fields
      stateId:   dtoData.stateId ? Number(dtoData.stateId) : 0,
      statusId:  dtoData.statusId ? Number(dtoData.statusId) : 1,                            
      contactMethod: dtoData.methodId ? Number(dtoData.methodId) : 0,
      bestTime: dtoData.bestTimeId ? Number(dtoData.bestTimeId) : 0,
    }

    if(dto.id){
      await updateCustomer.mutateAsync(dto as unknown as Customer);
    } else {
      await addNewCustomer.mutateAsync(dto as unknown as Customer);
    }

    //go back to customer dashboard
    navigate("/customerDashboard");
  }  

  //Status ID (active or archived)
  const [active, setActive] = useState<boolean>(
    selectedCustomer?.statusId == null ? true : selectedCustomer.statusId === 1);

  const [archiveWarning, setArchiveWarning] = useState<string | null>(null);
    
  useEffect(() => {
      setActive(selectedCustomer?.statusId == null ? true : selectedCustomer.statusId === 1);
    }, [selectedCustomer?.statusId]);
  
  //Set look-up for states, contact methods and best times
  const {states, contactMethods, bestTimes} = useLookups();

  
  // BEGIN RETURN
  
  if (!selectedCustomer) return <Typography>Customer Not Found</Typography>

  return (
    <Paper elevation={1} 
           sx={{ mb:4, p: 5, 
                 border:1, 
                 width: {xs: '100%', md: '65%'},
                 mx: 'auto', 
                 borderColor: "lightgray" }}>
      <Typography color="primary" fontWeight={500} variant="h5" gutterBottom marginBottom={4}>
        {selectedCustomer.id ? "Edit Customer" : "Add Customer"}
        <Divider sx={{borderColor: "primary.main", height:3, bgcolor:"#06526D", borderRadius:4}}/>
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Status Switch */}
        <FormGroup sx={{mb: 4}}>
          <FormControlLabel 
            label={active ? "Active" : "Archived"}
            control={
              <Switch 
                checked={active}
                color={active ? "success" : "default"}
                onChange={(_, checked) => {
                  //User is trying to set to Archived
                  if (!checked) {
                    const openRequestsOrAppts = requestAndApptsCountByCustomer?.totalCount ?? 0;

                    if (openRequestsOrAppts > 0) {
                      setArchiveWarning(
                        `This customer cannot be archived because they have active service requests or estimate appointments. Please close or complete them first.`);
                      
                        return;
                    }

                    setArchiveWarning(null);
                    setActive(checked);
                    onChange?.({ statusId: checked ? 1 : 2 });
                    setValue("statusId", checked ? 1 : 2, { 
                      shouldDirty: true, 
                      shouldValidate: true 
                    });
                  }                  
                }}
               />
              }
          />
          <input type="hidden" {...register("statusId")} />
          {archiveWarning && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              {archiveWarning}
            </Alert>
          )}
        </FormGroup>

        <Grid container spacing={3}>
          {/* First / Last Name */}
          <Grid size={{xs:12, md:6}}>
            
            <TextInput 
              label="First Name" 
              control={control} 
              name="firstName"
              slotProps={{ inputLabel: { shrink: selectedCustomer?.firstName ? true : undefined } }} />
           

          </Grid>
          <Grid size={{xs:12, md:6}}>
            <TextInput 
              label="Last Name" 
              control={control} 
              name="lastName"
              slotProps={{ inputLabel: { shrink: selectedCustomer?.lastName ? true : undefined } }} />
            
          </Grid>

          {/* Email */}
          <Grid size={{xs:12, md:6}}>
            <TextInput 
              label="Email" 
              control={control} 
              name="email"
              slotProps={{ inputLabel: { shrink: selectedCustomer?.email ? true : undefined } }} />

          </Grid>

          {/* Phone */}
          <Grid size={{xs:12, md:6}}>
            <TextInput 
              label="Phone" 
              control={control} 
              name="phone"
              slotProps={{
                input: { inputProps: {  inputMode: "tel", autoComplete: "tel" }}, 
                inputLabel: { shrink: selectedCustomer?.phone ? true : undefined } }} />
          </Grid>
          
          {/* Preferred Contact Method */}
          <Grid size={{ xs: 12, md: 5 }}>
            <SelectInput 
              items={contactMethods} 
              label="Preferred Method" 
              name="methodId" 
              control={control}
              getText={(m) => m.name }
              getValue={(m) => m.id}
              />            
          </Grid>

          {/* Best Time to Contact */}
          <Grid size={{ xs: 12, md: 3 }}>
            <SelectInput 
              items={bestTimes} 
              label="Best Time" 
              name="bestTimeId" 
              control={control}
              getText={(bt) => bt.name }
              getValue={(bt) => bt.id}
              />

          </Grid>

          {/* Address */}
          <Grid size={{xs:12}}>
            <TextInput 
              label="Address" 
              control={control} 
              name="address"
              slotProps={{ inputLabel: { shrink: selectedCustomer?.address ? true : undefined } }} />

          </Grid>

          {/* City / State / Zip */}
          <Grid size={{xs:12, md:5}}>
            <TextInput 
              label="City" 
              control={control} 
              name="city"
              slotProps={{ inputLabel: { shrink: selectedCustomer?.city ? true : undefined } }} />

          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            
            <SelectInput 
              items={states} 
              label="State" 
              name="stateId" 
              control={control}
              getText={(s) => s.shortName}
              getValue={(s) => s.id}
              />

          </Grid>
          
          <Grid size={{xs:12, md:4}}>
            <TextInput 
              label="Zip" 
              control={control} 
              name="zip"
              slotProps={{
                inputLabel: { shrink: selectedCustomer?.zip ? true : undefined},
                input: {
                inputProps: { 
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 10,
                   },
                }
              }} />
          </Grid>
        </Grid>

        {/* Actions: centered */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 6 }}>
          <Button component={RouterLink}
                  to={"/customerDashboard"} 
                  variant="contained" color="inherit" 
          >
            Cancel
          </Button>
          <Button variant="contained" 
                  type="submit"
                  disabled={updateCustomer.isPending || addNewCustomer.isPending}>
            Save
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}


