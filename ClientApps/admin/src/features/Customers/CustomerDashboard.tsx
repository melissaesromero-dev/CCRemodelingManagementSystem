import { Container, FormControl, InputLabel, MenuItem, Select, TablePagination, TextField } from "@mui/material";
import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,} from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from 'react-router';
import { btnLgSx} from "../../app/layout/Themes/theme";
import { useCustomers } from "../../hooks/useCustomers";
import { useLookups } from "../../hooks/useLookUps";
import CustomerRow from "./CustomerRow";


//START EXPORT FUNCTION
export default function CustomerDashboard() {
  const {updateCustomer, customers} = useCustomers();
  const [openId, setOpenId] = useState<string | null>(null);

  const {statesById,
         contactMethodsById,
         bestTimesById,
         } = useLookups() ?? {};

  const [statusFilter, setStatusFilter] = useState<"" | "1" | "2">("");          // 1=Active, 2=Archived
  const [methodFilter, setMethodFilter] = useState<"" | "1" | "2">("");          // 1=Phone, 2=Email
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [q, setQ] = useState("");

  const toggle = (id: string) => setOpenId((curr) => (curr === id ? null : id));

   // Filter + search
  const filtered = useMemo(() => {
  const list = customers ?? [];                 // <- default to []
  const term = q.trim().toLowerCase();
  return list.filter(c => {
    const name = `${c.fullName ?? `${c.firstName ?? ""} ${c.lastName ?? ""}`}`.toLowerCase();
    const matchesSearch =
      !term ||
      name.includes(term) ||
      (c.email ?? "").toLowerCase().includes(term) ||
      (c.phone ?? "").toLowerCase().includes(term);

    const matchesStatus = !statusFilter || String(c.statusId ?? "") === statusFilter;
    const matchesMethod = !methodFilter || String(c.contactMethod ?? "") === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });
}, [customers, q, statusFilter, methodFilter]);

  // pagination slice
  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  // reset to first page when filters/search change
  useEffect(() => setPage(0), [q, statusFilter, methodFilter]);

  
  //START RETURN
  return (
    <>
      <Container>
        <Button component={RouterLink}
                to={"/customerDashboard/customerForm"}
                variant="contained" color="primary" 
                sx={{...btnLgSx, mb:3}}
          >Add New Customer</Button>
        
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }} alignItems="stretch">
          {/* Search */}
          <TextField
            size="small"
            fullWidth
            placeholder="Search name, email, or phone…"
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
              onChange={(e) => setStatusFilter(e.target.value as "" | "1" | "2")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="2">Archived</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="method-filter-label">By Method</InputLabel>
            <Select
              labelId="method-filter-label"
              id="method-filter"
              label="By Method"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as "" | "1" | "2")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Phone</MenuItem>
              <MenuItem value="2">Email</MenuItem>
            </Select>
          </FormControl>

        </Stack>
            
        <TableContainer component={Paper} sx={{border: "none", boxShadow: "none", overflow: "auto", bgcolor: "#fff"}}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Preferred Method</TableCell>
                <TableCell>Best Time</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>No Customers Exist</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row) => {
                const isOpen = openId === row.id;
                
                return (
                  <CustomerRow
                    key={row.id}
                    row={row}
                    isOpen={isOpen}
                    onToggle={() => row.id && toggle(row.id)}
                    statesById={statesById}
                    contactMethodsById={contactMethodsById}
                    bestTimesById={bestTimesById}
                    updateCustomer={updateCustomer}
                  />
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