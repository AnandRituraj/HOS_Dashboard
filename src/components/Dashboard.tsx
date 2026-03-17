"use client";

import React, { useEffect, useState } from "react";
import { Container, Box, Grid, CircularProgress } from "@mui/material";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/DashboardHeader";
import StatsBar from "@/components/StatsBar";
import PieChartCard from "@/components/PieChartCard";
import ManagementSummary from "@/components/ManagementSummary";
import DashboardDailySection from "@/components/DashboardDailySection";
import WeeklyAttendance from "@/components/WeeklyAttendance";
import AddDriverDialog from "@/components/AddDriverDialog";
import LoginPage from "@/components/LoginPage";

export default function Dashboard() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const data = useDashboardData();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Still determining auth state
  if (session === undefined) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  if (data.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <DashboardHeader
        week={data.week}
        onWeekChange={data.setWeek}
        onLogout={handleLogout}
      />

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
