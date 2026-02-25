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
import { Driver, emptyDay } from "@/data/drivers";

interface DriverTableProps {
  drivers: Driver[];
  selectedDate: string;
  onToggleVehicleAssigned: (id: number, date: string) => void;
  onToggleFollowedPlan: (id: number, date: string) => void;
  onUpdateReason: (
    id: number,
    date: string,
    field: "vehicleReason" | "planReason",
    value: string
  ) => void;
}

export default function DriverTable({
  drivers,
  selectedDate,
  onToggleVehicleAssigned,
  onToggleFollowedPlan,
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
    const day = driver.days?.[selectedDate] || emptyDay();
    setReasonDialog({
      open: true,
      driverId: driver.id,
      field,
      value: day[field],
      driverName: driver.name,
      fieldLabel:
        field === "vehicleReason"
          ? "Vehicle Not Assigned"
          : "Didn't Follow Plan",
    });
  };

  const saveReason = () => {
    onUpdateReason(
      reasonDialog.driverId,
      selectedDate,
      reasonDialog.field,
      reasonDialog.value
    );
    setReasonDialog((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1565c0" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>#</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Driver Name
              </TableCell>
              <TableCell
                sx={{ color: "#fff", fontWeight: 700 }}
                align="center"
              >
                Vehicle Assigned
              </TableCell>
              <TableCell
                sx={{ color: "#fff", fontWeight: 700 }}
                align="center"
              >
                Followed Plan
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver, index) => {
              const day = driver.days?.[selectedDate] || emptyDay();
              return (
                <TableRow
                  key={driver.id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                    "&:hover": { backgroundColor: "action.selected" },
                    transition: "all 0.2s",
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
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={0.5}
                    >
                      <Switch
                        checked={day.vehicleAssigned}
                        onChange={() =>
                          onToggleVehicleAssigned(driver.id, selectedDate)
                        }
                        color="primary"
                        size="small"
                      />
                      <Chip
                        icon={
                          day.vehicleAssigned ? (
                            <CheckCircleIcon />
                          ) : (
                            <CancelIcon />
                          )
                        }
                        label={day.vehicleAssigned ? "Yes" : "No"}
                        color={day.vehicleAssigned ? "success" : "error"}
                        size="small"
                        variant="outlined"
                      />
                      {!day.vehicleAssigned && (
                        <Tooltip
                          title={
                            day.vehicleReason
                              ? day.vehicleReason
                              : "Add reason"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              openReasonDialog(driver, "vehicleReason")
                            }
                            color={day.vehicleReason ? "info" : "default"}
                          >
                            {day.vehicleReason ? (
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
                        checked={day.followedPlan}
                        onChange={() =>
                          onToggleFollowedPlan(driver.id, selectedDate)
                        }
                        color="primary"
                        size="small"
                      />
                      <Chip
                        icon={
                          day.followedPlan ? (
                            <CheckCircleIcon />
                          ) : (
                            <CancelIcon />
                          )
                        }
                        label={day.followedPlan ? "Yes" : "No"}
                        color={day.followedPlan ? "success" : "error"}
                        size="small"
                        variant="outlined"
                      />
                      {!day.followedPlan && (
                        <Tooltip
                          title={
                            day.planReason ? day.planReason : "Add reason"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              openReasonDialog(driver, "planReason")
                            }
                            color={day.planReason ? "info" : "default"}
                          >
                            {day.planReason ? (
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
              );
            })}
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
        <DialogTitle>Reason — {reasonDialog.driverName}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Why did this driver not meet the &quot;{reasonDialog.fieldLabel}
            &quot; criteria?
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
