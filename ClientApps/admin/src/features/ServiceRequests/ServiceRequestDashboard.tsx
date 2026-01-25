import { useEffect, useMemo, useState } from "react";
import { useServiceRequests } from "../../hooks/useServiceRequests";
import { Box, Button, Collapse, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { btnLgSx, btnMdSx } from "../../app/layout/Themes/theme";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from"@mui/icons-material/ExpandMore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SyncIcon from '@mui/icons-material/Sync';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Link, Link as RouterLink } from 'react-router';
import React from "react";
import { useLookups } from "../../hooks/useLookUps";
import dayjs from "dayjs";
import { useQuotes } from "../../hooks/useQuotes";
import { useEstimateAppts } from "../../hooks/useEstimateAppts";
import { useCustomers } from "../../hooks/useCustomers";

//START EXPORT FUNCTION
export default function ServiceRequestDashboard() {
    const {serviceRequests, updateServiceRequest} = useServiceRequests();
    const {estimateAppts, updateEstimateAppt} = useEstimateAppts();
    const {customers} = useCustomers();

    const customersById = useMemo(
      () => new Map((customers ?? []).map(c => [String(c.id), c])),
      [customers]
    );

    const {quoteByReqId} = useQuotes();

    const{statesById, budgetRangesById, serviceReqStatusesById} = useLookups() ?? {};
      
    const [showReopenBlockedDialog, setShowReopenBlockedDialog] = useState(false);

    const [openId, setOpenId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<"" | "1" | "2" | "3" | "4" | "5" | "6">(""); 
    // 1=Submitted, 2=Estimate Sent, 3=Customer Accepted/Approved, 4=In Progress, 5=Completed, 6=Closed 
    const [mainServiceTypeFilter, setMainServiceTypeFilter] = useState<"" | "1" | "2" | "3" | "4" | "5">("");
    // 1=Remodel, 2=Exterior/Outdoor, 3=Custom, 4=Repair, 5=Other
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const [q, setQ] = useState("");
    
    const toggle = (id: string) => setOpenId((curr) => (curr === id ? null : id));

    // Filter + search
      const filtered = useMemo(() => {
      const list = serviceRequests ?? [];                 // <- default to []
      const term = q.trim().toLowerCase();
      return list.filter((sr: ServiceRequest) => {
        const name = `${sr.custFullName ?? ""} ${sr.staffFullName ?? ""}`.toLowerCase();

        const matchesSearch =
          !term ||
          name.includes(term) ||
          (sr.mainServiceTypeDesc ?? "").toLowerCase().includes(term);
    
        const matchesStatus = !statusFilter || String(sr.statusId ?? "") === statusFilter;

        const matchesMainServiceType = 
          !mainServiceTypeFilter || String(sr.mainServiceTypeId ?? "") === mainServiceTypeFilter;

        return matchesSearch && matchesStatus && matchesMainServiceType;
      });
    }, [serviceRequests, q, statusFilter, mainServiceTypeFilter]);
    
      // pagination slice
      const paged = useMemo(() => {
        const start = page * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
      }, [filtered, page, rowsPerPage]);
    
      // reset to first page when filters/search change
      useEffect(() => setPage(0), [q, statusFilter, mainServiceTypeFilter]);

      //Handle close/re-open request button
      const handleToggleRequestStatus = async (sr: ServiceRequest) => {
        if (!sr.id) return;

        const isCurrentlyClosed = sr.statusId === 6;

        //If re-opening, make sure customer is not archived
        if (isCurrentlyClosed) {
          const customer = customersById.get(String(sr.customerId));

          // Archived customer = statusId === 2
          if (customer && customer.statusId === 2) {
            setShowReopenBlockedDialog(true);
            return; //block re-open
          }
        }
        const newStatusId = isCurrentlyClosed ? 1 : 6; // 1 = Submitted, 6 = Closed

        const updatedRequest: ServiceRequest = {
          ...sr,
          statusId: newStatusId,
        };

        try {
          // Find any estimate appointment linked to this request
          const existingAppt = estimateAppts?.find(
            (ea) => ea.serviceRequestId === sr.id
          );

          if (existingAppt) {
            let newApptStatusId = existingAppt.statusId;

            if (!isCurrentlyClosed && existingAppt.statusId !== 5) {
              // We are closing the request - close the appt (5 = Closed)
              newApptStatusId = 5;
            } else if (isCurrentlyClosed && existingAppt.statusId === 5) {
              // We are re-opening the request - change appt from Closed to Cancelled (3)
              // so it can be rescheduled
              newApptStatusId = 3;
            }

            if (newApptStatusId !== existingAppt.statusId) {
              await updateEstimateAppt.mutateAsync({
                ...existingAppt,
                statusId: newApptStatusId,
              } as EstimateAppt);
            }
          }

          await updateServiceRequest.mutateAsync(updatedRequest as ServiceRequest);
        } catch (error) {
          console.error("Failed to toggle service request status:", error);
        }
      };
    
    //START RETURN
    return (
    <>
      <Container>
        <Button component={RouterLink}
                        to={"/serviceRequestDashboard/serviceRequestForm"}variant="contained" color="primary" 
          sx={{...btnLgSx, mb:3}}
          >Add New Service Request</Button>
        
        
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }} alignItems="stretch">
          {/* Search */}
          <TextField
            size="small"
            fullWidth
            placeholder="Search customer name, staff name, or main service type"
            value={q}
            onChange={e => setQ(e.target.value)}
          />

          {/* Filters */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="status-filter-label">By Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              label="By Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "" | "1" | "2" | "3" | "4" | "5" | "6")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Submitted</MenuItem>
              <MenuItem value="2">Estimate Sent</MenuItem>
              <MenuItem value="3">Customer Accepted/Approved</MenuItem>
              <MenuItem value="4">In Progress</MenuItem>
              <MenuItem value="5">Completed</MenuItem>
              <MenuItem value="6">Closed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 210 }}>
            <InputLabel id="main-service-type-filter-label">By Main Service Type</InputLabel>
            <Select
              labelId="main-service-type-filter-label"
              id="main-service-type-filter"
              label="By Main Service Type"
              value={mainServiceTypeFilter}
              onChange={(e) => setMainServiceTypeFilter(e.target.value as "" | "1" | "2" | "3" | "4" | "5")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Remodel</MenuItem>
              <MenuItem value="2">Exterior/Outdoor</MenuItem>
              <MenuItem value="3">Custom</MenuItem>
              <MenuItem value="4">Repair</MenuItem>
              <MenuItem value="5">Other</MenuItem>
            </Select>
          </FormControl>

        </Stack>
            
        <TableContainer component={Paper} sx={{border: "none", boxShadow: "none", overflow: "auto", bgcolor: "#fff"}}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Request Num</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Staff</TableCell>
                <TableCell>Main Service Type</TableCell>
                <TableCell>Sub Service Type</TableCell>
                <TableCell>Desired Start Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>No Service Requests Exist</Typography>
                  </TableCell>
                </TableRow>
                ) : 
                (
                  paged.map((row) => {
                  const isOpen = openId === row.id;
                  const quote = row.id ? quoteByReqId(row.id) : undefined;
                  
                  return (
                    <React.Fragment key={row.id}>
                    <TableRow hover>
                      <TableCell>Req-{row.reqNum}</TableCell>
                      <TableCell>
                        {row.custFullName}
                      </TableCell>
                      <TableCell>{row.staffFullName}</TableCell>
                      <TableCell>
                        {row.mainServiceTypeDesc}
                      </TableCell>
                      <TableCell>
                        {row.subServiceTypeDesc}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {row.desiredStartDate ? dayjs(row.desiredStartDate).format("MM/DD/YYYY") : ""}
                        </Typography>
                      </TableCell>

                      {/* View Details, edit, and close*/}
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          gap={1}
                          flexWrap="wrap">
                          <Stack direction="row" alignItems="center" gap={1}>
                            <Button
                              size="small"
                              sx={{fontSize:11}}
                              variant="text"
                              onClick={() => row.id && toggle(row.id)}
                              endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              disabled={!row.id}>
                              Details
                            </Button>
                            <Button variant="contained" 
                                    component={RouterLink}
                                    to={`/serviceRequestDashboard/serviceRequestForm/${row.id}`}
                                    sx={{...btnMdSx}}
                                    >Edit</Button>
                            
                            {row.statusId !== 6 ? (
                              <Button variant="contained" 
                                  sx={{...btnMdSx, 
                                    bgcolor:'deleteColor.main',
                                    "&:hover": {
                                    bgcolor: "#b71c1c",
                                },}}
                                  onClick={() => handleToggleRequestStatus(row)}>
                                Close
                              </Button>
                            ) : (
                              <Button variant="contained" 
                                  sx={{...btnMdSx, 
                                    bgcolor:'success.main',
                                  "&:hover": {
                                      bgcolor: "#225d26",
                                  },}}
                                  onClick={() => handleToggleRequestStatus(row)}>
                                Re-Open
                              </Button>
                            )}                            
                          </Stack>
                        </Stack>
                      </TableCell>
                    </TableRow>

                    {/* Collapsible details row */}
                    <TableRow>
                      <TableCell colSpan={7} sx={{ p: 0, bgcolor: "background.default" }}>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2, fontSize:13,  color: 'text.primary'}}>
                            {/* Row 1: three columns */}
                            <Stack
                              direction={{ xs: "column", md: "row"}}
                              spacing={4}
                              sx={{ mb: 2}}>

                              {/* Status */}
                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="left" gap={1} sx={{ mb: 0.5}}>
                                  <SyncIcon  fontSize="small" />
                                                                
                                  <Typography component={"span"} variant="inherit" fontWeight={500}>Status:</Typography>
                                  <Typography component={"span"} variant="inherit" sx={{ textTransform: "capitalize"}}>
                                      {serviceReqStatusesById.get(row.statusId)?.description ?? String(row.statusId)}
                                  </Typography>
                                </Stack>
                              </Box>

                              {/* Quote */}
                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="left" gap={1} sx={{ mb: 0.5}}>
                                  <RequestQuoteIcon fontSize="small" />
                                  <Typography component={"span"} variant="inherit" fontWeight={500}>
                                      Quote Num: 
                                  </Typography>
                                  </Stack>
                                  <Stack direction="row"
                                    gap={1} 
                                    sx={{ m: 0, pl: 5, width:'100%', textTransform: "capitalize"}}>

                                  <Typography component={"span"} variant="inherit">
                                      {quote ? (
                                        <Link 
                                          to={`/quoteDashboard/quoteForm/${quote.id}/${row.id}`}
                                          state={{ from: "serviceRequestDashboard"}}>
                                              Q{quote!.quoteNum}
                                          </Link> 
                                        )  : (
                                      <Link
                                        to={
                                          row.id
                                            ? `/quoteDashboard/quoteForm/new/${row.id}`
                                            : "#"
                                        }
                                        state={{ from: "serviceRequestDashboard"}}
                                      >
                                        + Add New
                                      </Link> )}
                                  </Typography>
                                </Stack>
                              </Box>

                              {/* Estimate Appt Status */}
                              
                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="left" gap={1} sx={{ mb: 0.5}}>
                                  <CalendarMonthIcon fontSize="small" />
                                  <Typography component={"span"} variant="inherit" fontWeight={500}>
                                      Estimate Appointment Status: 
                                  </Typography>
                                </Stack>
                                <Stack direction="row"
                                    gap={1} 
                                    sx={{ m: 0, pl: 5, width:'100%'}} >
                                  {row.userId ? (
                                    row.estApptStatus ? (
                                      <Typography component="span" variant="inherit" sx={{textTransform: "capitalize"}}>
                                        {row.estApptStatus}
                                      </Typography>
                                    ) : (
                                      <Link
                                        to={
                                          row.id
                                            ? `/estimateApptDashboard/estimateApptForm/new/${row.id}`
                                            : "#"
                                        }
                                        state={{ from: "serviceRequestDashboard"}}
                                      >
                                        + Schedule Appointment
                                      </Link>
                                    )
                                  ) : (
                                    <Typography component="span" variant="inherit" sx={{textAlign:"left"}}>
                                      You must assign a staff to this service request before appointments can be
                                      scheduled.
                                    </Typography>
                                  )}
                                </Stack>
                              </Box>
                            </Stack>

                            {/* Row 2: three columns Service Address, Service Request Details, Budget Range */}
                            <Stack
                              direction={{ xs: "column", md: "row"}}
                              spacing={4}
                              sx={{ mb: 2, mt:3}}>
                              {/* Service Address */}
                              <Box sx={{ flex: 1  }}>
                                <Stack direction="row" alignItems="left"
                                textAlign="left" gap={1} sx={{ mb: 0 }}>
                                  <HomeIcon fontSize="small" />
                                  <Typography component={"span"} variant="inherit" fontWeight={500}>
                                      Service Address:
                                  </Typography>
                                </Stack>
                                <Stack direction="row"
                                    sx={{ m: 0, pl: 5, width:'100%'}} >
                                  <Typography component={"span"} variant="inherit">{row.serviceAddress}</Typography>
                                </Stack>
                                <Stack direction="row"
                                    sx={{ m: 0, pl: 5, width:'100%'}} >
                                  <Typography component={"span"} variant="inherit">
                                      {row.serviceCity},&nbsp; 
                                      {statesById.get(row.serviceStateId)?.shortName ?? String(row.serviceStateId)}{" "} 
                                      {row.serviceZip}
                                  </Typography>
                                </Stack>
                              </Box>

                              {/* Service Request Details */}
                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="left"
                                textAlign="left" gap={1} sx={{ mb: 0 }}>
                                  <DescriptionIcon fontSize="small" />
                                  <Typography component={"span"} variant="inherit" fontWeight={500}>
                                      Service Request Details:
                                  </Typography>
                                </Stack>
                                <Stack direction="row"
                                    sx={{ m: 0, pl: 5, textAlign:"left", width:"80%"}} >
                                  <Typography component={"span"} variant="inherit">
                                      {row.serviceDesc ?? ""}
                                  </Typography>
                                </Stack>
                                
                              </Box>

                              {/* Budget Range */}
                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="left"
                                textAlign="left" gap={1} sx={{ mb: 0 }}>
                                  <AttachMoneyIcon fontSize="small" />
                                  <Typography component={"span"} variant="inherit" fontWeight={500}>
                                      Budget Range:
                                  </Typography>
                                </Stack>
                                <Stack direction="row"
                                    sx={{ m: 0, pl: 5, width:'100%'}} >
                                  <Typography component={"span"} variant="inherit"> 
                                    {budgetRangesById.get(row.budgetRangeId)?.description ?? String(row.budgetRangeId)}
                                  </Typography>
                                </Stack>
                              </Box>
                            </Stack>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )  
            })
          )}
        </TableBody>
      </Table>
      
      {/* Pagination */}
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, 50]}
          count={filtered.length ?? 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          />
        </TableContainer>      

        {/*Block re-open due to customer being archived dialog box*/}
        <Dialog
          open={showReopenBlockedDialog}
          onClose={() => setShowReopenBlockedDialog(false)}
        >
          <DialogTitle>Cannot Re-open Request</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This service request cannot be re-opened because the associated
              customer is archived. 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => setShowReopenBlockedDialog(false)}
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>      
      </Container>
    </>
  )
}