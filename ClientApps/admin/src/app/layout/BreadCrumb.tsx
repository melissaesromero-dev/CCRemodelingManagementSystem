import { Box, Breadcrumbs, LinearProgress, Link, Paper, Typography, useScrollTrigger, Button } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import { useStore } from "../../hooks/useStore";
import { Observer } from "mobx-react-lite";
import { useEstimateAppts } from "../../hooks/useEstimateAppts";
import { useSampleData } from "../../hooks/useSampleData";

const TITLES: Record<string, string> = {
  "/customerDashboard": "Customer Dashboard",
  "/serviceRequestDashboard": "Service Request Dashboard",
  "/estimateApptDashboard": "Estimate Appointment Dashboard",
  "/quoteDashboard": "Quote Dashboard",
};

function pretty(seg: string) {
  return decodeURIComponent(seg).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function titleFor(path: string) {
  if (TITLES[path]) return TITLES[path];
  const parts = path.split("/").filter(Boolean);
  const lastSeg = parts.at(-1) ?? "";
  return pretty(lastSeg);
}

export default function BreadCrumb() {
  const { loadingStore } = useStore();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  //Sample data buttons
  const {sampleExists, deleteSampleData, loadSampleData} = useSampleData();

  const isSampleLoaded = !!sampleExists.data;
  const isBusy = 
    sampleExists.isLoading ||
    loadSampleData.isPending ||
    deleteSampleData.isPending;
  
  const location = useLocation();
  const { pathname } = location;
  const navState = location.state as
    | { from?: "serviceRequestDashboard" | "customerDashboard" | "quoteDashboard" | "estimateApptDashboard" }
    | null;
  
  // Home = mainDashboard only
  const isHome = pathname === "/mainDashboard";

  // Match: /estimateApptDashboard/estimateApptForm/:apptId/:reqId
  const eaMatch = pathname.match(
    /^\/estimateApptDashboard\/estimateApptForm\/([^/]+)\/([^/]+)$/
  );

  const apptId = eaMatch?.[1];
  const reqId  = eaMatch?.[2];
  
  const {isEdit, isNewForSpecificRequest} = useEstimateAppts({Id: apptId, reqId, disableQueries: true,}); // <-- used only for EA add vs edit

  // Hide breadcrumb on login
  if (pathname === "/login" || pathname === "/" ) return null;

  // Customer form helpers
  const isCustomerFormBase =
    pathname === "/customerDashboard/customerForm" ||
    pathname === "/customerDashboard/customerForm/";
  const isCustomerFormEdit = /^\/customerDashboard\/customerForm\/[^/]+\/?$/.test(pathname);
  const isForm = isCustomerFormBase || isCustomerFormEdit;

  // Service Request form helper (any variant of this route)
  const isSRForm = pathname.startsWith("/serviceRequestDashboard/serviceRequestForm");
  const isServiceRequestFormEdit = /^\/serviceRequestDashboard\/serviceRequestForm\/[^/]+\/?$/.test(pathname);
  
  // Estimate Appointment form helper (any variant of this route)
  const isEstimateApptFormRoute = pathname.startsWith("/estimateApptDashboard/estimateApptForm");

  // Quote form helpers
  // Matches /quoteDashboard/quoteForm/:quoteId/:reqId
  const quoteMatch = pathname.match(
    /^\/quoteDashboard\/quoteForm\/([^/]+)\/([^/]+)\/?$/
  );
  const quoteId = quoteMatch?.[1];
  const isQuoteFormBase =
    pathname === "/quoteDashboard/quoteForm" ||
    pathname === "/quoteDashboard/quoteForm/";
  const isQuoteFormRoute = isQuoteFormBase || !!quoteMatch;
  const isQuoteEdit = !!quoteId && quoteId !== "new";

  // build generic segments
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((_, i, arr) => `/${arr.slice(0, i + 1).join("/")}`);
  const last = segments[segments.length - 1];

  let crumbs: { to: string; label: string }[] = [];
  let active: string = "";

  switch (true) {
    // Home
    case isHome: {
      crumbs = [];
      active = "";
      break;
    }
    
    // Customer form (add/edit)
    case isForm: {
      crumbs = [{ to: "/customerDashboard", label: "Customer Dashboard" }];
      active = isCustomerFormEdit ? "Edit Customer" : "Add New Customer";
      break;
    }

    // Service Request form (add/edit)
    case isSRForm: {
      const fromCustomerDashboard = 
        navState?.from === "customerDashboard";

      const fromQuoteDashboard = 
        navState?.from === "quoteDashboard";

      const fromEstimateApptDashboard = 
        navState?.from === "estimateApptDashboard";

      if(fromCustomerDashboard){
        crumbs = [{to: "/customerDashboard", label: "Customer Dashboard", }]
      } else if(fromQuoteDashboard) {
        crumbs = [{ to: "/quoteDashboard", label: "Quote Dashboard" }]
      } else if(fromEstimateApptDashboard) {
        crumbs = [{ to: "/estimateApptDashboard", label: "Estimate Appointment Dashboard" }]
      }  else {
        crumbs = [{ to: "/serviceRequestDashboard", label: "Service Request Dashboard" }]
      }

      active = isServiceRequestFormEdit ? "Edit Service Request" : "Add New Service Request";
      break;
    }

    // Estimate Appointment form (add/edit)
    case isEstimateApptFormRoute: {
      
      if(isNewForSpecificRequest){
        crumbs = [{ to: "/serviceRequestDashboard", label: "Service Request Dashboard" }];
      }else {
        crumbs = [{ to: "/estimateApptDashboard", label: "Estimate Appointment Dashboard" }];
      }

      active = isEdit
        ? "Edit Estimate Appointment"
        : "Add New Estimate Appointment";
      break;
    }

    // Quote form (add/edit, from SR, Customer, or from QuoteDashboard)
    case isQuoteFormRoute: {
      const fromServiceDashboard =
        navState?.from === "serviceRequestDashboard";
        
      const fromCustomerDashboard = 
        navState?.from === "customerDashboard";

      if(fromCustomerDashboard){
        crumbs = [{to: "/customerDashboard", label: "Customer Dashboard", }]
      } else if (fromServiceDashboard) {
        crumbs = [{to: "/serviceRequestDashboard", label: "Service Request Dashboard", }]
      } else {
        crumbs = [{ to: "/quoteDashboard", label: "Quote Dashboard" }]
      }

      active = isQuoteEdit ? "Edit Quote" : "Add New Quote";
      break;
    }

    // Default: build from path segments
    default: {
      crumbs = segments.slice(0, -1).map(to => ({ to, label: titleFor(to) }));
      active = titleFor(last);
      break;
    }
  }

  return (
    <Box
      component={Paper}
      sx={{
        position: "sticky",
        left: 0,
        right: 0,
        top: 110,
        mb: 0,
        px: 4,
        py: 2,
        zIndex: (t) => t.zIndex.appBar - 1,
        bgcolor: "black",
        borderRadius: 0,
      }}
      elevation={trigger ? 1 : 0}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%"}}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          !isHome && (
            <Box sx={{ mx: 0.5, color: "neutral.main", lineHeight: 1 }}>
              &#x3e;
            </Box>
          )}
        sx={{ fontSize: 12, mt: 0.5, "& .MuiBreadcrumbs-separator": { mx: 0.5 } }}
      >
        {/* Home */}
        <Link component={RouterLink} to="/mainDashboard" underline="none" color="tertiary.main">
          <HomeOutlined fontSize="inherit" /> Home
        </Link>

        {/* Middle crumbs */}
        {crumbs.map((c) => (
          <Link key={c.to} component={RouterLink} to={c.to} underline="none" color="tertiary.main">
            {c.label}
          </Link>
        ))}

        {/* Active page */}
        <Typography
          component="span"
          aria-current="page"
          sx={{ fontSize: 13, fontWeight: 400, color: "neutral.main" }}
        >
          {active}
        </Typography>
      </Breadcrumbs>
      {/* RIGHT SIDE BUTTONS */}
      <Box
        sx={{
          ml: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {/* Reports (always visible) */}
        <Button
          component={RouterLink}
          to="/reports"
          size="small"
          sx={{
            ml: 2,
            whiteSpace: "nowrap",
            borderColor: "neutral.main",
            color: "neutral.main",
            "&:hover": { borderColor: "tertiary.main", color: "tertiary.main" },
          }}
        >
          Reports
        </Button>

        {/* Sample Data (Home only) */}
        {isHome && (
          <Button
            size="small"
            disabled={isBusy}
            sx={{
              ml: 2,
              mt: 0.75,
              whiteSpace: "nowrap",
              borderColor: "neutral.main",
              color: "neutral.main",
              "&:hover": { borderColor: "tertiary.main", color: "tertiary.main" },
            }}
            onClick={() => 
              isSampleLoaded
                ? deleteSampleData.mutate()
                : loadSampleData.mutate()
              }
            
          >
            {isBusy
              ? "Working..."
              : isSampleLoaded
                ? "Delete Sample Data"
                : "Load Sample Data"}
          </Button>
        )}
      </Box>
      </Box>
      
      <Observer>
        {() =>
          loadingStore.isLoading ? (
            <LinearProgress
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
                backgroundColor: "darkgray",
                "& .MuiLinearProgress-bar": { backgroundColor: "lightgray" },
              }}
            />
          ) : null
        }
      </Observer>
    </Box>
  );
}
