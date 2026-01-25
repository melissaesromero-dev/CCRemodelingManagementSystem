// src/components/customers/CustomerRow.tsx

import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import ArchiveIcon from "@mui/icons-material/Archive";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import { Link, Link as RouterLink } from 'react-router';
import { btnMdSx } from "../../app/layout/Themes/theme";
import { useCustomers } from "../../hooks/useCustomers";
import type { Lookup } from "../../hooks/useLookUps";

type CustomerRowProps = {
  row: Customer;
  isOpen: boolean;
  onToggle: () => void;
  statesById: Map<number, State>;
  contactMethodsById: Map<number, Lookup>;
  bestTimesById: Map<number, Lookup>;
  updateCustomer: ReturnType<typeof useCustomers>["updateCustomer"];
};

const CustomerRow: React.FC<CustomerRowProps> = ({
  row,
  isOpen,
  onToggle,
  statesById,
  contactMethodsById,
  bestTimesById,
  updateCustomer,
}) => {
  const [archiveWarning, setArchiveWarning] = useState<string | null>(null);

  const { requestAndApptsCountByCustomer, isRACPending } = useCustomers(row.id);

  const handleArchive = async () => {
    if (!row.id) return;

    setArchiveWarning(null);

    // Block until we've actually checked counts
    if (isRACPending) {
      setArchiveWarning(
        "Checking open service requests and estimate appointments…"
      );
      return;
    }

    const openRequestsOrAppts =
      requestAndApptsCountByCustomer?.totalCount ?? 0;

    if (openRequestsOrAppts > 0) {
      setArchiveWarning(
        "This customer cannot be archived because they have active service requests and/or estimate appointments. Please close or complete them first."
      );
      return;
    }

    // Safe to archive
    await updateCustomer.mutateAsync({
      ...row,
      statusId: 2, // archived
    } as Customer);
  };

  const handleActivate = async () => {
    if (!row.id) return;

    await updateCustomer.mutateAsync({
      ...row,
      statusId: 1, // active
    } as Customer);
  };

  return (
    <>
      {archiveWarning && (
        <TableRow>
          <TableCell
            colSpan={6}
            sx={{
              p: 0,
              borderBottom: 0,
            }}
          >
            <Alert
              severity="warning"
              onClose={() => setArchiveWarning(null)}
              sx={{
                borderRadius: 0,
                m: 0,
              }}
            >
              {archiveWarning}
            </Alert>
          </TableCell>
        </TableRow>
      )}

      <TableRow 
        hover>
        
        <TableCell>{row.fullName}</TableCell>
        <TableCell>
          <Link to={`mailto:${row.email}`}>{row.email}</Link>
        </TableCell>
        <TableCell>
          {row.phone
            ? row.phone
                .replace(/\D/g, "")
                .replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3")
            : ""}
        </TableCell>
        <TableCell>
          {contactMethodsById.get(row.contactMethod)?.name ??
            String(row.contactMethod)}
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {bestTimesById.get(row.bestTime)?.name ?? String(row.bestTime)}
          </Typography>
        </TableCell>

        {/* View Details, edit, and archive */}
        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            flexWrap="wrap"
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Button
                size="small"
                sx={{ fontSize: 11 }}
                variant="text"
                onClick={onToggle}
                endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                disabled={!row.id}
              >
                Details
              </Button>
              <Button
                component={RouterLink}
                to={row.id ? `/customerDashboard/customerForm/${row.id}` : "#"}
                variant="contained"
                sx={{ ...btnMdSx }}
              >
                Edit
              </Button>
              
              {row.statusId === 1 
                ? 
                    <Button
                        variant="contained"
                        sx={{
                        ...btnMdSx,
                        bgcolor: "deleteColor.main",
                        "&:hover": {
                            bgcolor: "#b71c1c",
                        },
                        }}
                        onClick={handleArchive}
                    >
                        Archive
                    </Button>
                : 
                    <Button
                        variant="contained"
                        sx={{
                        ...btnMdSx,
                        bgcolor: "success.main",
                        "&:hover": {
                            bgcolor: "#225d26",
                        },
                        }}
                        onClick={handleActivate}
                    >
                        Activate
                    </Button>
                }              
              
            </Stack>
            
          </Stack>
          
        </TableCell>
        
      </TableRow>
      

      {/* Collapsible details row (same markup as before) */}
      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0, bgcolor: "background.default" }}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              {/* Row 1: three columns */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={4}
                sx={{ mb: 2 }}
              >
                {/* Status */}
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="left"
                    gap={1}
                    sx={{ mb: 0.5 }}
                  >
                    {row.statusId === 1 ? (
                      <CheckCircleIcon fontSize="small" color="success" />
                    ) : (
                      <ArchiveIcon
                        fontSize="small"
                        sx={{ color: "deleteColor.main" }}
                      />
                    )}

                    <Typography variant="body2" fontWeight={500}>
                      Status:
                    </Typography>
                    <Typography variant="body2">
                      {row.statusId === 1 ? "Active" : "Archived"}
                    </Typography>
                  </Stack>
                </Box>

                {/* Open Requests */}
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="left"
                    textAlign="left"
                    gap={1}
                    sx={{ mb: 0 }}
                  >
                    <AssignmentIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={500}>
                      All Requests:
                    </Typography>
                    <Typography variant="body2">
                      {row.openRequestsCount ?? 0}
                    </Typography>
                  </Stack>
                  
                  {row.statusId === 1
                    ? 
                     <Stack
                    direction="row"
                    gap={1}
                    sx={{ m: 0, pl: 5, width: "100%" }}
                  >
                    <Link
                      to={`/serviceRequestDashboard/serviceRequestForm/${row.id}/new`}
                      state={{from: "customerDashboard"}}
                    >
                                                           
                      + Add New
                    </Link>
                  </Stack>
                  : "" }

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{ m: 0, pl: 5, width: "100%" }}
                  >
                    {row.openRequestsCount > 0
                      ? row.openRequests.map((r, i) => (
                          <Typography key={i} variant="body2">
                            <Link to={`/serviceRequestDashboard/serviceRequestForm/${r.id}`}
                                  state={{ from: "customerDashboard"}}>
                                Req-{r.reqNum}
                            </Link>                            
                          </Typography>
                        ))
                      : ""}
                  </Stack>
                </Box>

                {/* Estimate Appointments */}
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="left"
                    textAlign="left"
                    gap={1}
                    sx={{ mb: 0 }}
                  >
                    <EventIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={500}>
                      Estimate Appointments:
                    </Typography>
                    <Typography variant="body2">
                      {row.estApptsCount ?? 0}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{ m: 0, mt: 1, pl: 5, width: "100%" }}
                  >
                    {row.estApptsCount > 0
                      ? row.estApptDates.map((a, i) => (
                          <Typography key={i} variant="body2">
                            {dayjs(a).format("MM/DD/YYYY")}
                          </Typography>
                        ))
                      : ""}
                  </Stack>
                </Box>
              </Stack>

              {/* Row 2: three columns (last one empty) */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={4}
                sx={{ mb: 2, mt: 3 }}
              >
                {/* Address */}
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="left"
                    textAlign="left"
                    gap={1}
                    sx={{ mb: 0 }}
                  >
                    <HomeIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={500}>
                      Address:
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ m: 0, pl: 5, width: "100%" }}
                  >
                    <Typography variant="body2">{row.address}</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ m: 0, pl: 5, width: "100%" }}
                  >
                    <Typography variant="body2">
                      {row.city},&nbsp;
                      {statesById.get(row.stateId)?.shortName ??
                        String(row.stateId)}{" "}
                      {row.zip}
                    </Typography>
                  </Stack>
                </Box>

                {/* Quotes */}
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="left"
                    textAlign="left"
                    gap={1}
                    sx={{ mb: 0 }}
                  >
                    <AttachMoneyIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={500}>
                      Quotes:
                    </Typography>
                    <Typography variant="body2">
                      {row.quotesCount ?? 0}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{ m: 0, mt: 1, pl: 5, width: "100%" }}
                  >
                    {row.quotesCount > 0
                      ? row.quotes.map((q, i) => (
                          <Typography key={i} variant="body2">
                            <Link 
                                to={`/quoteDashboard/quoteForm/${q.id}/${q.serviceRequestId}`}
                                state={{ from: "customerDashboard"}}>
                                    Q-{q.quoteNum}
                            </Link>
                          </Typography>
                        ))
                      : ""}
                  </Stack>
                </Box>

                {/* Empty box for alignment */}
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="left"
                    textAlign="left"
                    gap={1}
                    sx={{ mb: 0 }}
                  >
                    <Typography variant="body2" fontWeight={500}></Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CustomerRow;
