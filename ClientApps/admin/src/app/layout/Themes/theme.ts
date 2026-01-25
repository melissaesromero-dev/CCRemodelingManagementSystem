// theme.ts
import { createTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

/* =========
   Reusable SX helpers (what you had in cardStyles.ts / Button Styles.ts)
   ========= */
export const cardSx: SxProps<Theme> = {
  minHeight: 210,
  border: 1,
  borderColor: "#727D71",
};

export const headerRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 1,
  mb: 3,
};

export const titleSx: SxProps<Theme> = { letterSpacing: 1 };

export const countSx: SxProps<Theme> = {
  mt: 1,
  textAlign: "center",
  textShadow: "1px 2px 4px rgba(0,0,0,0.3)",
  color: "#FCA311",
};

// Buttons
export const btnSx: SxProps<Theme> = { borderRadius: 4 };
export const btnSmSx: SxProps<Theme> = { borderRadius: 4, fontSize: 9 };
export const btnMdSx: SxProps<Theme> = { borderRadius: 4, fontSize: 11 };
export const btnLgSx: SxProps<Theme> = { borderRadius: 4, fontSize: 14 };

// Accordion
export const accordionCardSx: SxProps<Theme> = {
  border: 1,
  borderColor: "#727D71",
};

/* =========
   Unified MUI theme
   ========= */

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
    neutral: Palette["primary"];
    neutralDarker: Palette["primary"];
    deleteColor: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
    neutral?: PaletteOptions["primary"];
    neutralDarker?: PaletteOptions["primary"];
    deleteColor?: PaletteOptions["primary"];
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#086788" }, // brand accent (matches btnPrimarySx)
    secondary: { main: "#727D71" },
    success: { main: "#2e7d32" },
    warning: { main: "#ed6c02" },
    info: { main: "#0288d1" },
    error: { main: "#d32f2f" },
    tertiary: { main: "#FCA311" },
    neutral: { main: "#F2F2F2" },
    neutralDarker: { main: "#CCCCCC" },
    deleteColor: { main: "#C44536" },
    background: { default: "#f9faf9", paper: "#ffffff" },
    text: { primary: "#333a2f" },
  },
  shape: { borderRadius: 8 },

  components: {
    /* ----- Buttons: global radius + size font tweaks ----- */
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 4 },
        sizeSmall: { fontSize: 9 },
        sizeMedium: { fontSize: 11 },
        sizeLarge: { fontSize: 14 },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            color: "#fff",
            "&:hover": { backgroundColor: "#065a73" },
          },
        },
      ],
    },

    /* ----- Card ----- */
    MuiCard: {
      variants: [
        {
          props: { variant: "outlined", raised: false }, // just a key combo
          style: {
            minHeight: 210,
            border: "1px solid #727D71",
          },
        },
        {
          props: { variant: "outlined", sx: { ["--variant"]: "dashboard" } },
          style: {
            minHeight: 210,
            border: "1px solid #727D71",
          },
        },
      ],
    },

    MuiCardActionArea: {
      styleOverrides: {
        root: {
          transition: "background-color .25s ease",
          "&:hover": {
            backgroundColor: "#e6f0f3",
          },

          "&:hover .MuiCardActionArea-focusHighlight": { opacity: 0 },
        },
      },
    },

    /* ----- Accordion ----- */
    MuiAccordion: {
      variants: [
        {
          // use: <Accordion data-variant="bordered" />
          props: { sx: { ["--variant"]: "bordered" } },
          style: {
            border: "1px solid #727D71",
            borderRadius: 8,
            overflow: "hidden",
          },
        },
      ],
    },

    /* ----- Inputs general radius ----- */
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },

    /* ----- Table styles (header, zebra rows, cell alignment, padding, borders) ----- */
    MuiTableContainer: {
      styleOverrides: {
        root: { borderRadius: 8, overflow: "hidden" },
      },
    },

    MuiTable: {
      defaultProps: { stickyHeader: true, size: "small" },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          "& th": {
            color: "#727d71",
            fontWeight: 700,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            paddingTop: 15,
            paddingBottom: 15,
            textAlign: "center",
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: "center",
        },
        body: {
          fontSize: "0.8rem",
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          // Zebra: target cells for stronger specificity
          "& .MuiTableRow-root:nth-of-type(odd) .MuiTableCell-root": {
            backgroundColor: "#f1f5f2",
            color: "#333a2f",
            // padding typo fixed:
            paddingTop: 10,
          },
          // bottom borders only (no side borders)
          "& .MuiTableCell-root": {
            borderLeft: "none",
            borderRight: "none",
            paddingTop: 10,
            paddingBottom: 10,
          },
          "& .MuiTableRow-root td": {
            borderBottom: "0px solid rgba(255,255,255)", // effectively none
          },
          "& .MuiTableRow-root:last-of-type td": {
            borderBottom: "none",
          },
        },
      },
    },
  },
});
