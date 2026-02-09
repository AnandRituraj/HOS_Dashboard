"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Driver, initialDrivers } from "@/data/drivers";
import DriverTable from "@/components/DriverTable";
import PieChartCard from "@/components/PieChartCard";
import StatsBar from "@/components/StatsBar";

const STORAGE_KEY = "hos-dashboard-drivers";
const WEEK_STORAGE_KEY = "hos-dashboard-week";
const SUMMARY_STORAGE_KEY = "hos-dashboard-summary";

function getDefaultWeek() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split("T")[0],
    end: sunday.toISOString().split("T")[0],
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
  const [week, setWeek] = useState<{ start: string; end: string }>(() => {
    if (typeof window === "undefined") return getDefaultWeek();
    try {
      const saved = localStorage.getItem(WEEK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : getDefaultWeek();
    } catch {
      return getDefaultWeek();
    }
  });
  const [summary, setSummary] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(SUMMARY_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDriverName, setNewDriverName] = useState("");

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(WEEK_STORAGE_KEY, JSON.stringify(week));
  }, [week]);

  useEffect(() => {
    localStorage.setItem(SUMMARY_STORAGE_KEY, summary);
  }, [summary]);

  const toggleVehicleAssigned = (id: number) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              vehicleAssigned: !d.vehicleAssigned,
              vehicleReason: !d.vehicleAssigned ? "" : d.vehicleReason,
            }
          : d
      )
    );
  };

  const toggleFollowedPlan = (id: number) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              followedPlan: !d.followedPlan,
              planReason: !d.followedPlan ? "" : d.planReason,
            }
          : d
      )
    );
  };

  const toggleIncluded = (id: number) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, included: !d.included } : d
      )
    );
  };

  const updateReason = (
    id: number,
    field: "vehicleReason" | "planReason",
    value: string
  ) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
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
        vehicleAssigned: false,
        followedPlan: false,
        included: true,
        vehicleReason: "",
        planReason: "",
      },
    ]);
    setNewDriverName("");
    setDialogOpen(false);
  };

  // Only count included drivers for stats and charts
  const counted = drivers.filter((d) => d.included);
  const vehicleYes = counted.filter((d) => d.vehicleAssigned).length;
  const vehicleNo = counted.length - vehicleYes;
  const planYes = counted.filter((d) => d.followedPlan).length;
  const planNo = counted.length - planYes;

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

      {/* Stats Bar */}
      <Box mb={4}>
        <StatsBar drivers={drivers} />
      </Box>

      {/* Pie Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PieChartCard
            title="Vehicle Assigned While Driving"
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

      {/* Driver Table Header + Add Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Drivers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {counted.length} of {drivers.length} included in stats
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RestartAltIcon />}
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem(WEEK_STORAGE_KEY);
              localStorage.removeItem(SUMMARY_STORAGE_KEY);
              setDrivers(initialDrivers);
              setWeek(getDefaultWeek());
              setSummary("");
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

      {/* Driver Table */}
      <DriverTable
        drivers={[...drivers].sort((a, b) => Number(b.included) - Number(a.included))}
        onToggleVehicleAssigned={toggleVehicleAssigned}
        onToggleFollowedPlan={toggleFollowedPlan}
        onToggleIncluded={toggleIncluded}
        onUpdateReason={updateReason}
      />

      {/* Management Summary */}
      <Box mt={4}>
        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
          <SummarizeIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>
            Management Summary
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          Key points, suggestions, and takeaways for management review.
          Use each line as a bullet point.
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={12}
          variant="outlined"
          placeholder={"- Driver compliance improved by 10% this week\n- 3 drivers missed plan due to route changes\n- Recommend additional training for new drivers\n- Vehicle assignment process needs review"}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "background.paper",
            },
          }}
        />
        {summary.trim() && (
          <Box
            mt={2}
            p={2}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle2" color="primary" mb={1}>
              Preview
            </Typography>
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
