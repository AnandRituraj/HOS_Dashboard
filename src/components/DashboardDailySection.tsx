"use client";

import React from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Driver } from "@/data/drivers";
import { getDayTabLabel, getTodayStr } from "@/lib/dateUtils";
import DriverTable from "@/components/DriverTable";

interface DashboardDailySectionProps {
  drivers: Driver[];
  driverCount: number;
  weekDates: string[];
  selectedDayIdx: number;
  setSelectedDayIdx: (idx: number) => void;
  selectedDate: string;
  onReset: () => void;
  onAddDriverClick: () => void;
  onToggleVehicleAssigned: (id: number, date: string) => void;
  onToggleFollowedPlan: (id: number, date: string) => void;
  onUpdateReason: (
    id: number,
    date: string,
    field: "vehicleReason" | "planReason",
    value: string
  ) => void;
}

export default function DashboardDailySection({
  drivers,
  driverCount,
  weekDates,
  selectedDayIdx,
  setSelectedDayIdx,
  selectedDate,
  onReset,
  onAddDriverClick,
  onToggleVehicleAssigned,
  onToggleFollowedPlan,
  onUpdateReason,
}: DashboardDailySectionProps) {
  return (
    <>
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
            {driverCount} drivers &bull; Select a day tab below
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RestartAltIcon />}
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddDriverClick}
          >
            Add Driver
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={selectedDayIdx}
          onChange={(_, newIdx: number) => setSelectedDayIdx(newIdx)}
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

      <DriverTable
        drivers={drivers}
        selectedDate={selectedDate}
        onToggleVehicleAssigned={onToggleVehicleAssigned}
        onToggleFollowedPlan={onToggleFollowedPlan}
        onUpdateReason={onUpdateReason}
      />
    </>
  );
}
