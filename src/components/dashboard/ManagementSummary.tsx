"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import SummarizeIcon from "@mui/icons-material/Summarize";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface ManagementSummaryProps {
  summary: string;
  setSummary: (value: string) => void;
  editingSummary: boolean;
  setEditingSummary: (value: boolean) => void;
}

export default function ManagementSummary({
  summary,
  setSummary,
  editingSummary,
  setEditingSummary,
}: ManagementSummaryProps) {
  return (
    <Box mb={4}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <SummarizeIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>
            Management Summary
          </Typography>
        </Box>
        {editingSummary ? (
          <Button
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
            onClick={() => setEditingSummary(false)}
            disabled={!summary.trim()}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => setEditingSummary(true)}
          >
            Edit
          </Button>
        )}
      </Box>

      {editingSummary ? (
        <>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Key points, suggestions, and takeaways for management review. Use
            each line as a bullet point.
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={12}
            variant="outlined"
            placeholder={
              "- Driver compliance improved by 10% this week\n- 3 drivers missed plan due to route changes\n- Recommend additional training for new drivers\n- Vehicle assignment process needs review"
            }
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "background.paper",
              },
            }}
          />
        </>
      ) : (
        <Box
          p={2}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            cursor: "pointer",
            "&:hover": { borderColor: "primary.main" },
            transition: "border-color 0.2s",
          }}
          onClick={() => setEditingSummary(true)}
        >
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
  );
}
