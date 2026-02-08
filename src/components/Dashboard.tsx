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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Driver, initialDrivers } from "@/data/drivers";
import DriverTable from "@/components/DriverTable";
import PieChartCard from "@/components/PieChartCard";
import StatsBar from "@/components/StatsBar";

const STORAGE_KEY = "hos-dashboard-drivers";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDriverName, setNewDriverName] = useState("");

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
  }, [drivers]);

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
              setDrivers(initialDrivers);
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
