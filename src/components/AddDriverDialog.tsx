"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface AddDriverDialogProps {
  open: boolean;
  onClose: () => void;
  driverName: string;
  onDriverNameChange: (value: string) => void;
  onAdd: () => void;
}

export default function AddDriverDialog({
  open,
  onClose,
  driverName,
  onDriverNameChange,
  onAdd,
}: AddDriverDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add New Driver</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Driver Name"
          fullWidth
          variant="outlined"
          value={driverName}
          onChange={(e) => onDriverNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAdd();
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onAdd} variant="contained" disabled={!driverName.trim()}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
