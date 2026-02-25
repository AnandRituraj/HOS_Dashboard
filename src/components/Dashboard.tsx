"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SummarizeIcon from "@mui/icons-material/Summarize";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Driver, initialDrivers, emptyDay } from "@/data/drivers";
import DriverTable from "@/components/DriverTable";
import PieChartCard from "@/components/PieChartCard";
import StatsBar from "@/components/StatsBar";
import WeeklyAttendance from "@/components/WeeklyAttendance";

const STORAGE_KEY = "hos-dashboard-drivers";
const SUMMARY_STORAGE_KEY = "hos-dashboard-summary";

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDefaultWeek() {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: toLocalDateStr(monday),
    end: toLocalDateStr(sunday),
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWeekDates(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start + "T12:00:00");
  const last = new Date(end + "T12:00:00");
  while (cur <= last) {
    dates.push(toLocalDateStr(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

const DAY_NAMES: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

function getDayTabLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const dayName = DAY_NAMES[d.getDay()];
  const month = d.toLocaleDateString("en-US", { month: "short" });
  return `${dayName} ${month} ${d.getDate()}`;
}

function getTodayStr(): string {
  return toLocalDateStr(new Date());
}

export default function Dashboard() {
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    if (typeof window === "undefined") return initialDrivers;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialDrivers;
    } catch {
      return initialDrivers;
    }
  });
  const [week, setWeek] = useState<{ start: string; end: string }>(getDefaultWeek);
  const [summary, setSummary] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(SUMMARY_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [editingSummary, setEditingSummary] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem(SUMMARY_STORAGE_KEY);
      return !saved || saved.trim() === "";
    } catch {
      return true;
    }
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDriverName, setNewDriverName] = useState("");

  const weekDates = useMemo(() => getWeekDates(week.start, week.end), [week]);

  // Default to today's tab if today is within the week, otherwise first day
  const [selectedDayIdx, setSelectedDayIdx] = useState(() => {
    const today = getTodayStr();
    const dates = getWeekDates(getDefaultWeek().start, getDefaultWeek().end);
    const idx = dates.indexOf(today);
    return idx >= 0 ? idx : 0;
  });

  const effectiveDayIdx = selectedDayIdx < weekDates.length ? selectedDayIdx : 0;
  const selectedDate = weekDates[effectiveDayIdx] || week.start;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(SUMMARY_STORAGE_KEY, summary);
  }, [summary]);

  // --- Day-aware handlers ---

  const getDriverDay = (driver: Driver, date: string) =>
    driver.days?.[date] || emptyDay();

  const toggleVehicleAssigned = (id: number, date: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const day = getDriverDay(d, date);
        return {
          ...d,
          days: {
            ...d.days,
            [date]: {
              ...day,
              vehicleAssigned: !day.vehicleAssigned,
              vehicleReason: !day.vehicleAssigned ? "" : day.vehicleReason,
            },
          },
        };
      })
    );
  };

  const toggleFollowedPlan = (id: number, date: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const day = getDriverDay(d, date);
        return {
          ...d,
          days: {
            ...d.days,
            [date]: {
              ...day,
              followedPlan: !day.followedPlan,
              planReason: !day.followedPlan ? "" : day.planReason,
            },
          },
        };
      })
    );
  };

  const updateReason = (
    id: number,
    date: string,
    field: "vehicleReason" | "planReason",
    value: string
  ) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const day = getDriverDay(d, date);
        return {
          ...d,
          days: {
            ...d.days,
            [date]: { ...day, [field]: value },
          },
        };
      })
    );
  };

  const toggleWorked = (driverId: number, date: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== driverId) return d;
        const current = d.workedDays?.[date] ?? false;
        return {
          ...d,
          workedDays: { ...d.workedDays, [date]: !current },
        };
      })
    );
  };

  const handleAddDriver = () => {
    if (newDriverName.trim() === "") return;
    const newId =
      drivers.length > 0 ? Math.max(...drivers.map((d) => d.id)) + 1 : 1;
    setDrivers((prev) => [
      ...prev,
      {
        id: newId,
        name: newDriverName.trim(),
        workedDays: {},
        days: {},
      },
    ]);
    setNewDriverName("");
    setDialogOpen(false);
  };

  // --- Per-driver weekly compliance (Yes on all worked days = Yes for the week) ---
  const getWorkedDates = (d: Driver) =>
    weekDates.filter((date) => d.workedDays?.[date]);

  const driversWhoWorked = drivers.filter(
    (d) => getWorkedDates(d).length > 0
  );
  const vehicleYes = driversWhoWorked.filter((d) =>
    getWorkedDates(d).every((date) => d.days?.[date]?.vehicleAssigned)
  ).length;
  const planYes = driversWhoWorked.filter((d) =>
    getWorkedDates(d).every((date) => d.days?.[date]?.followedPlan)
  ).length;
  const vehicleNo = driversWhoWorked.length - vehicleYes;
  const planNo = driversWhoWorked.length - planYes;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
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
                setWeek((prev) => ({ ...prev, start: e.target.value }))
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
              onChange={(e) =>
                setWeek((prev) => ({ ...prev, end: e.target.value }))
              }
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ width: 160 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Stats Bar (weekly aggregate) */}
      <Box mb={4}>
        <StatsBar
          drivers={drivers}
          weekDates={weekDates}
          driversWhoWorked={driversWhoWorked.length}
          vehicleYes={vehicleYes}
          planYes={planYes}
        />
      </Box>

      {/* Pie Charts (weekly aggregate) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PieChartCard
            title="Vehicle Assigned"
            yesCount={vehicleYes}
            noCount={vehicleNo}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PieChartCard
            title="Followed the Plan"
            yesCount={planYes}
            noCount={planNo}
          />
        </Grid>
      </Grid>

      {/* Management Summary */}
      <Box mb={4}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1.5}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <SummarizeIcon color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Management Summary
            </Typography>
          </Box>
          {editingSummary ? (
            <Button
              variant="contained"
              size="small"
              startIcon={<SaveIcon />}
              onClick={() => setEditingSummary(false)}
              disabled={!summary.trim()}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setEditingSummary(true)}
            >
              Edit
            </Button>
          )}
        </Box>

        {editingSummary ? (
          <>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Key points, suggestions, and takeaways for management review. Use
              each line as a bullet point.
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={12}
              variant="outlined"
              placeholder={
                "- Driver compliance improved by 10% this week\n- 3 drivers missed plan due to route changes\n- Recommend additional training for new drivers\n- Vehicle assignment process needs review"
              }
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "background.paper",
                },
              }}
            />
          </>
        ) : (
          <Box
            p={2}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              "&:hover": { borderColor: "primary.main" },
              transition: "border-color 0.2s",
            }}
            onClick={() => setEditingSummary(true)}
          >
            {summary
              .split("\n")
              .filter((line) => line.trim())
              .map((line, i) => (
                <Typography key={i} variant="body2" sx={{ py: 0.3 }}>
                  {line.trim().startsWith("-") || line.trim().startsWith("•")
                    ? line.trim()
                    : `• ${line.trim()}`}
                </Typography>
              ))}
          </Box>
        )}
      </Box>

      {/* Driver Table Header + Add/Reset */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Daily Driver Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {drivers.length} drivers &bull; Select a day tab below
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RestartAltIcon />}
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem(SUMMARY_STORAGE_KEY);
              setDrivers(initialDrivers);
              setWeek(getDefaultWeek());
              setSummary("");
              setEditingSummary(true);
              setSelectedDayIdx(0);
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Driver
          </Button>
        </Box>
      </Box>

      {/* Day Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={effectiveDayIdx}
          onChange={(_, newIdx) => setSelectedDayIdx(newIdx)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {weekDates.map((date, idx) => (
            <Tab
              key={date}
              label={getDayTabLabel(date)}
              value={idx}
              sx={{
                fontWeight: date === getTodayStr() ? 700 : 400,
                color: date === getTodayStr() ? "primary.main" : undefined,
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Driver Table for selected day */}
      <DriverTable
        drivers={drivers}
        selectedDate={selectedDate}
        onToggleVehicleAssigned={toggleVehicleAssigned}
        onToggleFollowedPlan={toggleFollowedPlan}
        onUpdateReason={updateReason}
      />

      {/* Weekly Attendance Grid */}
      <Box mt={4}>
        <WeeklyAttendance
          drivers={drivers}
          weekDates={weekDates}
          onToggleWorked={toggleWorked}
        />
      </Box>

      {/* Add Driver Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Add New Driver</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Driver Name"
            fullWidth
            variant="outlined"
            value={newDriverName}
            onChange={(e) => setNewDriverName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddDriver();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddDriver}
            variant="contained"
            disabled={newDriverName.trim() === ""}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
