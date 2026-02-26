"use client";

import React from "react";
import { Typography, Box, Chip, TextField } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { formatDate } from "@/lib/dateUtils";

interface DashboardHeaderProps {
  week: { start: string; end: string };
  onWeekChange: (week: { start: string; end: string }) => void;
}

export default function DashboardHeader({ week, onWeekChange }: DashboardHeaderProps) {
  return (
    <Box mb={4} textAlign="center">
      <Typography variant="h3" fontWeight={700} color="primary.main">
        HOS Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
        Driver Compliance Overview &mdash; Vehicle Assignment &amp; Plan
        Adherence
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mt={2}
        flexWrap="wrap"
      >
        <Chip
          icon={<CalendarMonthIcon />}
          label={`Week: ${formatDate(week.start)} — ${formatDate(week.end)}`}
          color="primary"
          variant="outlined"
          sx={{ fontSize: "0.95rem", py: 2.5, px: 1 }}
        />
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            type="date"
            label="From"
            size="small"
            value={week.start}
            onChange={(e) =>
              onWeekChange({ ...week, start: e.target.value })
            }
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 160 }}
          />
          <Typography color="text.secondary">to</Typography>
          <TextField
            type="date"
            label="To"
            size="small"
            value={week.end}
            onChange={(e) => onWeekChange({ ...week, end: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 160 }}
          />
        </Box>
      </Box>
    </Box>
  );
}
