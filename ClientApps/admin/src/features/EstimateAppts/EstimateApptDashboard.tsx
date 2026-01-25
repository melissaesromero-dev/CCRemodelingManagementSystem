import { Container, Button, Stack, TextField, FormControl, InputLabel, Select, MenuItem, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, TablePagination } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { btnLgSx, btnMdSx } from "../../app/layout/Themes/theme";
import { Link, Link as RouterLink } from 'react-router';
import { useEstimateAppts } from "../../hooks/useEstimateAppts";
import { useLookups } from "../../hooks/useLookUps";
import { useServiceRequests } from "../../hooks/useServiceRequests";


//START EXPORT FUNCTION
export default function EstimateApptDashboard() {
    const {estimateAppts, updateEstimateAppt} = useEstimateAppts();
    
    const {estApptStatusesById,} = useLookups() ?? {};

    const { serviceRequests } = useServiceRequests();

    const serviceReqById = useMemo(() => {
      return new Map(
        (serviceRequests ?? []).map((sr) => [String(sr.id), sr])
      );
    }, [serviceRequests]);

    const [statusFilter, setStatusFilter] = useState<"" | "1" | "2" | "3" | "4" | "5">("");  // 1=Scheduled, 2=Completed, 3=Cancelled, 4=missed, 5=closed
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
      
    const [q, setQ] = useState("");
    
    // Filter + search
    const filtered = useMemo(() => {
        const list = estimateAppts ?? []; // <- default to []
        const term = q.trim().toLowerCase();
    
        return list.filter(ea => {
            const matchesSearch =
                !term ||
                (ea.custFullName ?? "").toLowerCase().includes(term) ||
                (ea.scheduledDate ?? "").toLowerCase().includes(term) ||
                (ea.staffFullName ?? "").toLowerCase().includes(term);
    
        const matchesStatus = !statusFilter || String(ea.statusId ?? "") === statusFilter;
    
        return matchesSearch && matchesStatus;
      });
    }, [estimateAppts, q, statusFilter]);

    const renderApptActions = (row: EstimateAppt) => {
      const serviceRequest = serviceReqById.get(String(row.serviceRequestId));

      //if no assinged staff, show a message and NO buttons
      if (!row.staffFullName) {
        return (
          <Typography variant="caption" color="text.secondary" sx={{ width:160, textAlign:"left"}}>
            Scheduling is not allowed until a request has an assinged staff.
          </Typography>
        );
      }

      switch (row.statusId) {
        // Scheduled – show Edit + Cancel (your current behavior)
        case 1:
        case 4:
          return (
            <Stack direction="row" alignItems="center" gap={1}>
              <Button
                component={RouterLink}
                to={
                    row.id
                    ? `/estimateApptDashboard/estimateApptForm/${row.id}/${row.serviceRequestId}`
                    : '#'
                    }
                    state={{ from: "estimateApptDashboard"}}
                    variant="contained"
                    sx={{ ...btnMdSx }}
                  >
                  Edit
              </Button>

              <Button
                variant="contained"
                sx={{
                      ...btnMdSx,
                      bgcolor: 'deleteColor.main',
                              '&:hover': {
                      bgcolor: '#b71c1c',
                      },
                    }}
                  onClick={() => updateEstimateAppt.mutateAsync({
                                              ...row,
                                              statusId: 3,
                  })}
                  >
                  Cancel
              </Button>
            </Stack>
            );
        // Complete – show View
        case 2:
          return (
            <Stack direction="row" alignItems="center" gap={1}>
              <Button
                component={RouterLink}
                to={row.id
                    ? `/estimateApptDashboard/estimateApptForm/${row.id}/${row.serviceRequestId}`
                    : '#'
                    }
                state={{ from: "estimateApptDashboard"}}
                    variant="contained"
                    sx={{ ...btnMdSx }}
              >
                View
              </Button>
              {serviceRequest?.statusId === 5 
              ? (
                <Typography variant="caption" color="text.secondary" sx={{ width:160, textAlign:"left"}}>
                  Associated service request status is complete.
                </Typography>)
              : null}
            </Stack>
            );
        
        // Missed – show Re-schedule
        case 3:
          return (
            <Stack direction="row" alignItems="center" gap={1}>
              
              <Button
                component={RouterLink}
                to={row.serviceRequestId
                    ? `/estimateApptDashboard/estimateApptForm/${row.id}/${row.serviceRequestId}`
                    : '#'}
                state={{ from: "estimateApptDashboard"}}
                variant="contained"
                sx={{ ...btnMdSx }}
              >
                Re-schedule
              </Button>
            </Stack>
            );

          // Closed - service request has been closed
          case 5:
            return (
              <Stack direction="row" alignItems="center" gap={1}>
              <Button
                component={RouterLink}
                to={row.id
                    ? `/estimateApptDashboard/estimateApptForm/${row.id}/${row.serviceRequestId}`
                    : '#'
                    }
                state={{ from: "estimateApptDashboard"}}
                    variant="contained"
                    sx={{ ...btnMdSx }}
              >
                View
              </Button>
              <Typography variant="caption">Associated request has been closed.</Typography>
            </Stack>
            )

        default:
          return null;
      }};
    
      // pagination slice
      const paged = useMemo(() => {
        const start = page * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
      }, [filtered, page, rowsPerPage]);
    
      // reset to first page when filters/search change
      useEffect(() => setPage(0), [q, statusFilter]);
      
      
    //START RETURN
    return (
    <>
      <Container>
        <Button component={RouterLink}
                to={"/estimateApptDashboard/estimateApptForm"}
                variant="contained" color="primary" 
                sx={{...btnLgSx, mb:3}}
          >Add New Estimate Appointment</Button>
        
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }} alignItems="stretch">
          {/* Search */}
          <TextField
            size="small"
            fullWidth
            placeholder="Search name, date…"
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
              onChange={(e) => setStatusFilter(e.target.value as "" | "1" | "2" | "3")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Scheduled</MenuItem>
              <MenuItem value="2">Completed</MenuItem>
              <MenuItem value="3">Cancelled</MenuItem>
            </Select>
          </FormControl>

        </Stack>
            
        <TableContainer component={Paper} sx={{border: "none", boxShadow: "none", overflow: "auto", bgcolor: "#fff"}}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Appt Num</TableCell>
                <TableCell>Request Num</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Assigned Staff</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>No Appointments Exist</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row) => {
                return (
                  <React.Fragment key={row.id}>
                  <TableRow hover>
                    <TableCell>Appt-{row.estApptNum}</TableCell>
                    <TableCell>
                        <Link to={`/serviceRequestDashboard/serviceRequestForm/${row.serviceRequestId}`}
                              state={{ from: "estimateApptDashboard" }}>
                            Req-{row.requestNumber}
                        </Link></TableCell>
                    <TableCell>
                      {row.custFullName}
                    </TableCell>
                    <TableCell>
                      {row.staffFullName ? row.staffFullName : 'No Staff Assigned'}
                    </TableCell>
                    <TableCell>
                    {row.scheduledDate
                        ? dayjs(row.scheduledDate).format('MM/DD/YYYY')
                        : 'Not Set'}
                    </TableCell>
                    <TableCell>
                        {row.scheduledTime
                            ? dayjs(row.scheduledTime, 'H:mm:ss').format('h:mm A')
                            : 'Not Set'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {(estApptStatusesById.get(row.statusId)?.description ?? String(row.statusId))
  .replace(/\b\w/g, c => c.toUpperCase())}

                      </Typography>
                    </TableCell>

                    {/* Appt Actions (Edit, Cancel, Re-schedule, and View Appt*/}
                    <TableCell>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={1}
                        flexWrap="wrap">
                        {renderApptActions(row)}
                      </Stack>
                    </TableCell>
                  </TableRow>

              </React.Fragment>
                 ) })
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
      </Container>
    </>
  )
}