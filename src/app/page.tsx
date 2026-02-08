"use client";

import dynamic from "next/dynamic";
import { Box, CircularProgress } from "@mui/material";

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: false,
  loading: () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  ),
});

export default function Home() {
  return <Dashboard />;
}
