"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Driver } from "@/data/drivers";

interface WeeklyAttendanceProps {
  drivers: Driver[];
  weekDates: string[];
  onToggleWorked: (driverId: number, date: string) => void;
}

const DAY_LABELS: { [key: number]: string } = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

function getDayLabel(dateStr: string): { day: string; date: number } {
  const d = new Date(dateStr + "T12:00:00");
  return {
    day: DAY_LABELS[d.getDay()],
    date: d.getDate(),
  };
}

export default function WeeklyAttendance({
  drivers,
  weekDates,
  onToggleWorked,
}: WeeklyAttendanceProps) {
  return (
    <Box mb={4}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <EventAvailableIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Weekly Attendance
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{ borderRadius: 2, overflowX: "auto" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1565c0" }}>
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#1565c0",
                  zIndex: 2,
                  minWidth: 180,
                }}
              >
                Driver
              </TableCell>
              {weekDates.map((date) => {
                const label = getDayLabel(date);
                return (
                  <TableCell
                    key={date}
                    align="center"
                    sx={{ color: "#fff", fontWeight: 700, minWidth: 70 }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: "#fff", display: "block" }}
                      >
                        {label.day}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        {label.date}
                      </Typography>
                    </Box>
                  </TableCell>
                );
              })}
              <TableCell
                align="center"
                sx={{ color: "#fff", fontWeight: 700, minWidth: 80 }}
              >
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver, index) => {
              const daysWorked = weekDates.filter(
                (d) => driver.workedDays?.[d]
              ).length;
              return (
                <TableRow
                  key={driver.id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                    "&:hover": { backgroundColor: "action.selected" },
                    transition: "all 0.2s",
                  }}
                >
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: "background.paper",
                      zIndex: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {index + 1}. {driver.name}
                    </Typography>
                  </TableCell>
                  {weekDates.map((date) => (
                    <TableCell key={date} align="center" sx={{ py: 0.5 }}>
                      <Checkbox
                        checked={!!driver.workedDays?.[date]}
                        onChange={() => onToggleWorked(driver.id, date)}
                        size="small"
                        color="success"
                        sx={{
                          "&.Mui-checked": {
                            color: "#66bb6a",
                          },
                        }}
                      />
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Chip
                      label={`${daysWorked}/${weekDates.length}`}
                      size="small"
                      color={
                        daysWorked === weekDates.length
                          ? "success"
                          : daysWorked === 0
                            ? "error"
                            : "warning"
                      }
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
