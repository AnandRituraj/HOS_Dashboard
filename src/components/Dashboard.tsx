"use client";

import React from "react";
import { Container, Box, Grid } from "@mui/material";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/DashboardHeader";
import StatsBar from "@/components/StatsBar";
import PieChartCard from "@/components/PieChartCard";
import ManagementSummary from "@/components/ManagementSummary";
import DashboardDailySection from "@/components/DashboardDailySection";
import WeeklyAttendance from "@/components/WeeklyAttendance";
import AddDriverDialog from "@/components/AddDriverDialog";

export default function Dashboard() {
  const data = useDashboardData();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <DashboardHeader week={data.week} onWeekChange={data.setWeek} />

      <Box mb={4}>
        <StatsBar
          drivers={data.drivers}
          driversWhoWorked={data.driversWhoWorkedCount}
          vehicleYes={data.vehicleYes}
          planYes={data.planYes}
        />
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PieChartCard
            title="Vehicle Assigned"
            yesCount={data.vehicleYes}
            noCount={data.vehicleNo}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PieChartCard
            title="Followed the Plan"
            yesCount={data.planYes}
            noCount={data.planNo}
          />
        </Grid>
      </Grid>

      <ManagementSummary
        summary={data.summary}
        setSummary={data.setSummary}
        editingSummary={data.editingSummary}
        setEditingSummary={data.setEditingSummary}
      />

      <DashboardDailySection
        drivers={data.drivers}
        driverCount={data.drivers.length}
        weekDates={data.weekDates}
        selectedDayIdx={data.selectedDayIdx}
        setSelectedDayIdx={data.setSelectedDayIdx}
        selectedDate={data.selectedDate}
        onReset={data.handleReset}
        onAddDriverClick={() => data.setDialogOpen(true)}
        onToggleVehicleAssigned={data.toggleVehicleAssigned}
        onToggleFollowedPlan={data.toggleFollowedPlan}
        onUpdateReason={data.updateReason}
      />

      <Box mt={4}>
        <WeeklyAttendance
          drivers={data.drivers}
          weekDates={data.weekDates}
          onToggleWorked={data.toggleWorked}
        />
      </Box>

      <AddDriverDialog
        open={data.dialogOpen}
        onClose={() => data.setDialogOpen(false)}
        driverName={data.newDriverName}
        onDriverNameChange={data.setNewDriverName}
        onAdd={data.handleAddDriver}
      />
    </Container>
  );
}
