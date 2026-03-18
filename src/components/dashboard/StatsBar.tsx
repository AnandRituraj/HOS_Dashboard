"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { Driver } from "@/types";

interface StatsBarProps {
  drivers: Driver[];
  driversWhoWorked: number;
  vehicleYes: number;
  planYes: number;
}

export default function StatsBar({
  drivers,
  driversWhoWorked,
  vehicleYes,
  planYes,
}: StatsBarProps) {
  const total = driversWhoWorked;
  const vehiclePct = total > 0 ? ((vehicleYes / total) * 100).toFixed(1) : "—";
  const planPct = total > 0 ? ((planYes / total) * 100).toFixed(1) : "—";

  const stats = [
    {
      label: "Total Drivers",
      value: `${drivers.length}`,
      sub: `${total} active this week`,
    },
    {
      label: "Vehicle Assigned",
      value: vehiclePct === "—" ? "—" : `${vehiclePct}%`,
      sub: `${vehicleYes} of ${total} drivers`,
      valueColor:
        total === 0
          ? "#888"
          : Number(vehiclePct) >= 80
            ? "#22c55e"
            : Number(vehiclePct) >= 50
              ? "#f59e0b"
              : "#ef4444",
    },
    {
      label: "Followed Plan",
      value: planPct === "—" ? "—" : `${planPct}%`,
      sub: `${planYes} of ${total} drivers`,
      valueColor:
        total === 0
          ? "#888"
          : Number(planPct) >= 80
            ? "#22c55e"
            : Number(planPct) >= 50
              ? "#f59e0b"
              : "#ef4444",
    },
  ];

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      {stats.map((stat) => (
        <Box
          key={stat.label}
          sx={{
            flex: "1 1 180px",
            p: "20px 24px",
            backgroundColor: "#111111",
            border: "1px solid #1e1e1e",
            borderRadius: 2,
            transition: "border-color 0.15s",
            "&:hover": { borderColor: "#333" },
          }}
        >
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#666",
              mb: 1.5,
            }}
          >
            {stat.label}
          </Typography>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              lineHeight: 1,
              color: stat.valueColor ?? "#f5f5f5",
              fontVariantNumeric: "tabular-nums",
              mb: 0.75,
            }}
          >
            {stat.value}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#555" }}>
            {stat.sub}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
