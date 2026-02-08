"use client";

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PieChartCardProps {
  title: string;
  yesCount: number;
  noCount: number;
}

const COLORS = ["#4caf50", "#f44336"];

const renderCustomLabel = (props: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) => {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontWeight={700}
      fontSize={14}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartCard({
  title,
  yesCount,
  noCount,
}: PieChartCardProps) {
  const total = yesCount + noCount;
  const data = [
    { name: "Yes", value: yesCount },
    { name: "No", value: noCount },
  ];

  return (
    <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          textAlign="center"
        >
          {title}
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: 260,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  dataKey="value"
                  animationDuration={500}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value?: number | string, name?: string) => {
                    const v = Number(value) || 0;
                    return [
                      `${v} driver${v !== 1 ? "s" : ""} (${((v / total) * 100).toFixed(1)}%)`,
                      name ?? "",
                    ];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Typography color="text.secondary">No data available</Typography>
            </Box>
          )}
        </Box>
        <Box display="flex" justifyContent="center" gap={3} mt={1}>
          <Typography variant="body2" color="text.secondary">
            Yes: <strong>{yesCount}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No: <strong>{noCount}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: <strong>{total}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
