"use client";

import * as React from "react";
import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Linear-inspired design system
// Near-black background, single indigo accent, clean type, no decorative color
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5E6AD2",   // Linear's signature indigo
      dark: "#4B56B5",
      light: "#818CF8",
    },
    secondary: {
      main: "#22c55e",
    },
    background: {
      default: "#0a0a0a",
      paper: "#111111",
    },
    success: {
      main: "#22c55e",
    },
    error: {
      main: "#ef4444",
    },
    info: {
      main: "#3b82f6",
    },
    warning: {
      main: "#f59e0b",
    },
    divider: "#1e1e1e",
    text: {
      primary: "#f5f5f5",
      secondary: "#888888",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#111111",
          border: "1px solid #1e1e1e",
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#111111",
          border: "1px solid #1e1e1e",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 6,
          fontSize: "0.875rem",
        },
        contained: {
          backgroundColor: "#5E6AD2",
          color: "#fff",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#4B56B5",
            boxShadow: "none",
          },
        },
        outlined: {
          borderColor: "#2a2a2a",
          color: "#f5f5f5",
          "&:hover": {
            borderColor: "#444",
            backgroundColor: "#1a1a1a",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: "0.78rem",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 400,
          fontSize: "0.875rem",
          color: "#888",
          "&.Mui-selected": {
            color: "#f5f5f5",
            fontWeight: 500,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#5E6AD2",
          height: 2,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #1a1a1a",
          padding: "10px 16px",
        },
        head: {
          backgroundColor: "#0d0d0d",
          color: "#666",
          fontSize: "0.72rem",
          fontWeight: 600,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          borderBottom: "1px solid #1e1e1e",
          padding: "12px 16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#161616",
          },
          "&:last-child td": {
            borderBottom: "none",
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#111111",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#444",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#5E6AD2",
            borderWidth: 1,
          },
        },
        notchedOutline: {
          borderColor: "#2a2a2a",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#666",
          fontSize: "0.875rem",
          "&.Mui-focused": {
            color: "#5E6AD2",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#5E6AD2",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#5E6AD2",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#111111",
          border: "1px solid #2a2a2a",
          boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          fontWeight: 600,
          borderBottom: "1px solid #1e1e1e",
          paddingBottom: 16,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#1e1e1e",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#888",
          "&:hover": {
            backgroundColor: "#1a1a1a",
            color: "#f5f5f5",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1e1e1e",
          border: "1px solid #2a2a2a",
          fontSize: "0.78rem",
          color: "#f5f5f5",
        },
        arrow: {
          color: "#1e1e1e",
        },
      },
    },
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "mui" });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
