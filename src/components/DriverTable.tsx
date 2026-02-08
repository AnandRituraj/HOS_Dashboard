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
  Switch,
  Chip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Driver } from "@/data/drivers";

interface DriverTableProps {
  drivers: Driver[];
  onToggleVehicleAssigned: (id: number) => void;
  onToggleFollowedPlan: (id: number) => void;
}

export default function DriverTable({
  drivers,
  onToggleVehicleAssigned,
  onToggleFollowedPlan,
}: DriverTableProps) {
  return (
    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "primary.main",
            }}
          >
            <TableCell sx={{ color: "white", fontWeight: 700 }}>#</TableCell>
            <TableCell sx={{ color: "white", fontWeight: 700 }}>
              Driver Name
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">
              Vehicle Assigned
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">
              Followed Plan
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {drivers.map((driver, index) => (
            <TableRow
              key={driver.id}
              sx={{
                "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                "&:hover": { backgroundColor: "action.selected" },
                transition: "background-color 0.2s",
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {index + 1}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight={500}>
                  {driver.name}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Switch
                  checked={driver.vehicleAssigned}
                  onChange={() => onToggleVehicleAssigned(driver.id)}
                  color="primary"
                  size="small"
                />
                <Chip
                  icon={
                    driver.vehicleAssigned ? (
                      <CheckCircleIcon />
                    ) : (
                      <CancelIcon />
                    )
                  }
                  label={driver.vehicleAssigned ? "Yes" : "No"}
                  color={driver.vehicleAssigned ? "success" : "error"}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  checked={driver.followedPlan}
                  onChange={() => onToggleFollowedPlan(driver.id)}
                  color="primary"
                  size="small"
                />
                <Chip
                  icon={
                    driver.followedPlan ? <CheckCircleIcon /> : <CancelIcon />
                  }
                  label={driver.followedPlan ? "Yes" : "No"}
                  color={driver.followedPlan ? "success" : "error"}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
