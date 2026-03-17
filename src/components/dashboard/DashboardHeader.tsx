"use client";

import React, { useState } from "react";
import { Typography, Box, Chip, TextField, Button, IconButton, Tooltip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import { formatDate, getWeekForDate, shiftWeek, getDefaultWeek } from "@/lib/dateUtils";

interface DashboardHeaderProps {
  week: { start: string; end: string };
  onWeekChange: (week: { start: string; end: string }) => void;
  onLogout: () => void;
}

export default function DashboardHeader({ week, onWeekChange, onLogout }: DashboardHeaderProps) {
  const [jumpDate, setJumpDate] = useState("");

  function handleJump(dateStr: string) {
    if (!dateStr) return;
    onWeekChange(getWeekForDate(dateStr));
    setJumpDate("");
  }

  return (
    <Box mb={4} textAlign="center" position="relative">
      <Button
        onClick={onLogout}
        startIcon={<LogoutIcon />}
        size="small"
        color="inherit"
        sx={{ position: "absolute", top: 0, right: 0, opacity: 0.6 }}
      >
        Sign out
      </Button>
      <Typography variant="h3" fontWeight={700} color="primary.main">
        HOS Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
        Driver Compliance Overview &mdash; Vehicle Assignment &amp; Plan
        Adherence
      </Typography>

      {/* Week navigation row */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={1} mt={2} flexWrap="wrap">
        <Tooltip title="Previous week">
          <IconButton onClick={() => onWeekChange(shiftWeek(week, -1))} size="small">
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>

        <Chip
          icon={<CalendarMonthIcon />}
          label={`Week: ${formatDate(week.start)} — ${formatDate(week.end)}`}
          color="primary"
          variant="outlined"
          sx={{ fontSize: "0.95rem", py: 2.5, px: 1 }}
        />

        <Tooltip title="Next week">
          <IconButton onClick={() => onWeekChange(shiftWeek(week, 1))} size="small">
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Go to current week">
          <IconButton onClick={() => onWeekChange(getDefaultWeek())} size="small">
            <TodayIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Custom range + jump to date row */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={1.5} mt={1.5} flexWrap="wrap">
        <TextField
          type="date"
          label="From"
          size="small"
          value={week.start}
          onChange={(e) => onWeekChange({ ...week, start: e.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: 150 }}
        />
        <Typography color="text.secondary">to</Typography>
        <TextField
          type="date"
          label="To"
          size="small"
          value={week.end}
          onChange={(e) => onWeekChange({ ...week, end: e.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: 150 }}
        />

        <Box display="flex" alignItems="center" gap={0.5}>
          <TextField
            type="date"
            label="Jump to date"
            size="small"
            value={jumpDate}
            onChange={(e) => {
              setJumpDate(e.target.value);
              if (e.target.value) handleJump(e.target.value);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 165 }}
          />
        </Box>
      </Box>
    </Box>
  );
}
