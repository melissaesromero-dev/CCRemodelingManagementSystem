import { Container, Button, Stack, TextField, FormControl, InputLabel, Select, MenuItem, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Collapse, Box, TablePagination, Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions, } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { btnLgSx, btnMdSx } from "../../app/layout/Themes/theme";
import { Link, Link as RouterLink } from 'react-router';
import { useQuotes } from "../../hooks/useQuotes";
import { useLookups } from "../../hooks/useLookUps";
import ExpandMoreIcon from"@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";



//START EXPORT
export default function QuoteDashboard() {
    const {quotes, deleteQuote} = useQuotes();
      const [openId, setOpenId] = useState<string | null>(null);
    
      const { quoteStatusesById } = useLookups() ?? {};
    
      const [statusFilter, setStatusFilter] = useState<"" | "1" | "2" | "3" | "4">("");          // 1=Draft, 2=Sent, 3=Accepted, 4=Declined
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);
      
      const [q, setQ] = useState("");

      // Delete dialog state
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

      const handleOpenDeleteDialog = (quote: Quote) => {
        setQuoteToDelete(quote);
        setDeleteDialogOpen(true);
        };

      const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setQuoteToDelete(null);
        };

      const handleConfirmDelete = async () => {
        if (!quoteToDelete?.id) return;

      // call mutation
      await deleteQuote.mutateAsync(quoteToDelete.id);

        setDeleteDialogOpen(false);
        setQuoteToDelete(null);
      };
    
      const toggle = (id: string) => setOpenId((curr) => (curr === id ? null : id));
    
       // Filter + search
      const filtered = useMemo(() => {
      const list = quotes ?? [];                 // <- default to []
      const term = q.trim().toLowerCase();
      return list.filter(q => {
        const matchesSearch =
          !term ||
          String(q.requestNumber ?? "").includes(term) ||
          (q.serviceMainTypeDesc ?? "").toLowerCase().includes(term)||
          (q.serviceSubTypeDesc ?? "").toLowerCase().includes(term);
    
        const matchesStatus = !statusFilter || String(q.statusId ?? "") === statusFilter;
        
        return matchesSearch && matchesStatus;
      });
    }, [quotes, q, statusFilter]);
    
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
                    to={"/quoteDashboard/quoteForm"}
                    state={{ from: "quoteDashboard"}}
                    variant="contained" color="primary" 
                    sx={{...btnLgSx, mb:3}}
            >Create New Quote</Button>
            
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }} alignItems="stretch">
            {/* Search */}
            <TextField
                size="small"
                fullWidth
                placeholder="Search request number, or service type…"
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
                onChange={(e) => setStatusFilter(e.target.value as "" | "1" | "2" | "3" | "4")}
                >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="1">Draft</MenuItem>
                <MenuItem value="2">Sent</MenuItem>
                <MenuItem value="3">Accepted</MenuItem>
                <MenuItem value="4">Declined</MenuItem>
                </Select>
            </FormControl>

            </Stack>
                
            <TableContainer component={Paper} sx={{border: "none", boxShadow: "none", overflow: "auto", bgcolor: "#fff"}}>
            <Table size="small">
                <TableHead>
                <TableRow>
                    <TableCell>Quote Num</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Total Cost Estimate</TableCell>
                    <TableCell>Request Num</TableCell>
                    <TableCell>Main Service Type</TableCell>
                    <TableCell>Sub Service Type</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                </TableHead>

                <TableBody>
                    {filtered.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Typography>No Quotes Exist</Typography>
                    </TableCell>
                    </TableRow>
                ) : (
                    paged.map((row) => {
                    const isOpen = openId === row.id;
                    return (
                    <React.Fragment key={row.id}>
                    <TableRow hover>
                        <TableCell>Quote-{row.quoteNum}</TableCell>
                        <TableCell>
                            <Typography variant="body2">
                                {(quoteStatusesById.get(row.statusId)?.description ?? String(row.statusId))
                                .replace(/\b\w/g, q => q.toUpperCase())}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            ${row.totalCostEstimate?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                            <Link to={`/serviceRequestDashboard/serviceRequestForm/${row.serviceRequestId}`}
                                  state={{ from: "quoteDashboard"}} >
                                Req-{row.requestNumber}
                            </Link>                        
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2">
                                {row.serviceMainTypeDesc}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2">
                                {row.serviceSubTypeDesc}
                            </Typography>
                        </TableCell>

                        {/* View Details, edit, and delete*/}
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
                            <Button component={RouterLink}
                                    to={row.id 
                                        ? `/quoteDashboard/quoteForm/${row.id}/${row.serviceRequestId}` : '#'}
                                    state={{ from: "quoteDashboard"}} 
                                    variant="contained" 
                                    sx={{...btnMdSx}}
                                    >Edit</Button>
                            <Button
                                variant="contained"
                                sx={{
                                ...btnMdSx,
                                bgcolor: 'deleteColor.main',
                                '&:hover': {
                                    bgcolor: '#b71c1c'
                                },
                                }}
                                onClick={() => handleOpenDeleteDialog(row)}
                            >
                                Delete
                            </Button>
                            </Stack>
                        </Stack>
                        </TableCell>
                    </TableRow>

                    {/* Collapsible details row */}
                    <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0, bgcolor: "background.default" }}>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2 }}>
                            {/* Row 1: two columns */}
                            <Stack
                                direction={{ xs: "column", md: "row"}}
                                spacing={4}
                                sx={{ mb: 2}}>
                                
                                {/* Labor Details */}
                                <Box sx={{ flex: 1  }}>
                                    <Stack direction="row" alignItems="left"
                                    textAlign="left" gap={1} sx={{ mb: 0 }}>
                                        <AssignmentIcon fontSize="small" />
                                        <Typography variant="body2"
                                        fontWeight={500}>Labor Details:</Typography>
                                    </Stack>
                                    <Stack direction="row"
                                        sx={{ 
                                            m: 2, p: 1, 
                                            width:'100%', 
                                            border: 1,
                                            borderColor: 'lightgray',
                                            borderRadius: 2,
                                            minHeight: '150px'}} >
                                        <Typography variant="body2">
                                            {row.laborDetails ?? ""}
                                        </Typography>

                                    </Stack>
                                </Box>

                                {/* Material Details */}
                                <Box sx={{ flex: 1  }}>
                                    <Stack direction="row" alignItems="left"
                                    textAlign="left" gap={1} sx={{ mb: 0 }}>
                                        <AssignmentIcon fontSize="small" />
                                        <Typography variant="body2"
                                        fontWeight={500}>Material Details:</Typography>
                                    </Stack>
                                    <Stack direction="row"
                                        sx={{ 
                                            m: 2, p: 1, 
                                            width:'100%', 
                                            border: 1,
                                            borderColor: 'lightgray',
                                            borderRadius: 2,
                                            minHeight: '150px'}} >
                                        <Typography variant="body2">
                                            {row.materialDetails ?? ""}
                                        </Typography>

                                    </Stack>
                                </Box>
                            </Stack>
                            
                            {/* Row 2: two columns */}
                            <Stack
                                direction={{ xs: "column", md: "row"}}
                                spacing={4}
                                sx={{ mb: 2, mt:3}}>
                                
                                {/* Labor cost estimate */}
                                <Box sx={{ flex: 1  }}>
                                    <Stack direction="row" alignItems="left"
                                    textAlign="left" gap={1} sx={{ mb: 0 }}>
                                        <AttachMoneyIcon fontSize="small" />
                                        <Typography variant="body2"
                                        fontWeight={500}>Labor Cost Estimate:</Typography>
                                    </Stack>
                                    <Stack direction="row"
                                        sx={{ m: 0, pl: 5, width:'100%'}} >
                                        <Typography variant="body2">
                                            ${row.laborCostEstimate?.toLocaleString()}
                                        </Typography>
                                    </Stack>
                                </Box>

                                {/* Material cost estimate */}
                                <Box sx={{ flex: 1  }}>
                                    <Stack direction="row" alignItems="left"
                                    textAlign="left" gap={1} sx={{ mb: 0 }}>
                                        <AttachMoneyIcon fontSize="small" />
                                        <Typography variant="body2"
                                        fontWeight={500}>Material Cost Estimate:</Typography>
                                    </Stack>
                                    <Stack direction="row"
                                        sx={{ m: 0, pl: 5, width:'100%'}} >
                                        <Typography variant="body2">
                                            ${row.materialCostEstimate?.toLocaleString()}
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>                            
                        </Box>
                        </Collapse>
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

            <Dialog
            open={deleteDialogOpen}
            onClose={handleCancelDelete}
            >
            <DialogTitle>Delete this quote?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {quoteToDelete
                    ? `Are you sure you want to permanently delete Quote #${quoteToDelete.quoteNum}? This action cannot be undone.`
                    : "Are you sure you want to permanently delete this quote? This action cannot be undone."}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelDelete} color="inherit">
                Cancel
                </Button>
                <Button
                onClick={handleConfirmDelete}
                color="error"
                variant="contained"
                disabled={deleteQuote.isPending}
                >
                Delete
                </Button>
            </DialogActions>
            </Dialog>           
        </Container>
        </>
  )
}