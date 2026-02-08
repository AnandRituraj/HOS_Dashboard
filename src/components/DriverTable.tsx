"use client";

import React, { useState } from "react";
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
  Checkbox,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CommentIcon from "@mui/icons-material/Comment";
import { Driver } from "@/data/drivers";

interface DriverTableProps {
  drivers: Driver[];
  onToggleVehicleAssigned: (id: number) => void;
  onToggleFollowedPlan: (id: number) => void;
  onToggleIncluded: (id: number) => void;
  onUpdateReason: (
    id: number,
    field: "vehicleReason" | "planReason",
    value: string
  ) => void;
}

export default function DriverTable({
  drivers,
  onToggleVehicleAssigned,
  onToggleFollowedPlan,
  onToggleIncluded,
  onUpdateReason,
}: DriverTableProps) {
  const [reasonDialog, setReasonDialog] = useState<{
    open: boolean;
    driverId: number;
    field: "vehicleReason" | "planReason";
    value: string;
    driverName: string;
    fieldLabel: string;
  }>({
    open: false,
    driverId: 0,
    field: "vehicleReason",
    value: "",
    driverName: "",
    fieldLabel: "",
  });

  const openReasonDialog = (
    driver: Driver,
    field: "vehicleReason" | "planReason"
  ) => {
    setReasonDialog({
      open: true,
      driverId: driver.id,
      field,
      value: driver[field],
      driverName: driver.name,
      fieldLabel:
        field === "vehicleReason" ? "Vehicle Not Assigned" : "Didn't Follow Plan",
    });
  };

  const saveReason = () => {
    onUpdateReason(reasonDialog.driverId, reasonDialog.field, reasonDialog.value);
    setReasonDialog((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#1565c0",
              }}
            >
              <TableCell sx={{ color: "#fff", fontWeight: 700 }} align="center">
                Count
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>#</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Driver Name
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }} align="center">
                Vehicle Assigned
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }} align="center">
                Followed Plan
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver, index) => (
              <TableRow
                key={driver.id}
                sx={{
                  opacity: driver.included ? 1 : 0.5,
                  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                  "&:hover": { backgroundColor: "action.selected" },
                  transition: "all 0.2s",
                }}
              >
                <TableCell align="center">
                  <Tooltip
                    title={
                      driver.included
                        ? "Included in stats — click to exclude"
                        : "Excluded from stats — click to include"
                    }
                  >
                    <Checkbox
                      checked={driver.included}
                      onChange={() => onToggleIncluded(driver.id)}
                      size="small"
                      color="primary"
                    />
                  </Tooltip>
                </TableCell>
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
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={0.5}
                  >
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
                    />
                    {!driver.vehicleAssigned && (
                      <Tooltip
                        title={
                          driver.vehicleReason
                            ? driver.vehicleReason
                            : "Add reason"
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            openReasonDialog(driver, "vehicleReason")
                          }
                          color={driver.vehicleReason ? "info" : "default"}
                        >
                          {driver.vehicleReason ? (
                            <CommentIcon fontSize="small" />
                          ) : (
                            <EditNoteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={0.5}
                  >
                    <Switch
                      checked={driver.followedPlan}
                      onChange={() => onToggleFollowedPlan(driver.id)}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      icon={
                        driver.followedPlan ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )
                      }
                      label={driver.followedPlan ? "Yes" : "No"}
                      color={driver.followedPlan ? "success" : "error"}
                      size="small"
                      variant="outlined"
                    />
                    {!driver.followedPlan && (
                      <Tooltip
                        title={
                          driver.planReason ? driver.planReason : "Add reason"
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            openReasonDialog(driver, "planReason")
                          }
                          color={driver.planReason ? "info" : "default"}
                        >
                          {driver.planReason ? (
                            <CommentIcon fontSize="small" />
                          ) : (
                            <EditNoteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reason Dialog */}
      <Dialog
        open={reasonDialog.open}
        onClose={() => setReasonDialog((prev) => ({ ...prev, open: false }))}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Reason — {reasonDialog.driverName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Why did this driver not meet the &quot;{reasonDialog.fieldLabel}&quot; criteria?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={reasonDialog.value}
            onChange={(e) =>
              setReasonDialog((prev) => ({ ...prev, value: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setReasonDialog((prev) => ({ ...prev, open: false }))
            }
          >
            Cancel
          </Button>
          <Button onClick={saveReason} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
