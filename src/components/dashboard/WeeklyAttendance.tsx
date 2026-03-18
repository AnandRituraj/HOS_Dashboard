"use client";

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
import { Driver } from "@/types";

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
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#0d0d0d",
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
                    sx={{ minWidth: 70 }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, display: "block", color: "#666", fontSize: "0.72rem", letterSpacing: "0.07em" }}
                      >
                        {label.day}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#555", fontSize: "0.72rem" }}
                      >
                        {label.date}
                      </Typography>
                    </Box>
                  </TableCell>
                );
              })}
              <TableCell align="center" sx={{ minWidth: 80 }}>
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
                  sx={{ transition: "background-color 0.1s" }}
                >
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: "#111111",
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
                            color: "success.main",
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
