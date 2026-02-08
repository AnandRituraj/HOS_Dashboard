"use client";

import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { Driver } from "@/data/drivers";

interface StatsBarProps {
  drivers: Driver[];
}

export default function StatsBar({ drivers }: StatsBarProps) {
  const total = drivers.length;
  const vehicleYes = drivers.filter((d) => d.vehicleAssigned).length;
  const planYes = drivers.filter((d) => d.followedPlan).length;

  const vehiclePct = total > 0 ? ((vehicleYes / total) * 100).toFixed(1) : "0";
  const planPct = total > 0 ? ((planYes / total) * 100).toFixed(1) : "0";

  const stats = [
    {
      label: "Total Drivers",
      value: total,
      icon: <PeopleIcon sx={{ fontSize: 36, color: "primary.main" }} />,
      color: "primary.main",
    },
    {
      label: "Vehicle Assigned",
      value: `${vehicleYes}/${total} (${vehiclePct}%)`,
      icon: (
        <DirectionsCarIcon sx={{ fontSize: 36, color: "success.main" }} />
      ),
      color: "success.main",
    },
    {
      label: "Followed Plan",
      value: `${planYes}/${total} (${planPct}%)`,
      icon: (
        <AssignmentTurnedInIcon sx={{ fontSize: 36, color: "info.main" }} />
      ),
      color: "info.main",
    },
  ];

  return (
    <Box
      display="flex"
      gap={2}
      flexWrap="wrap"
      justifyContent="center"
    >
      {stats.map((stat) => (
        <Paper
          key={stat.label}
          elevation={2}
          sx={{
            flex: "1 1 200px",
            maxWidth: 320,
            p: 2.5,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {stat.icon}
          <Box>
            <Typography variant="body2" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography variant="h6" fontWeight={700} color={stat.color}>
              {stat.value}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
