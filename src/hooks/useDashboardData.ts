"use client";

import { useState, useEffect, useMemo } from "react";
import { Driver, initialDrivers, emptyDay } from "@/data/drivers";
import { getDefaultWeek, getWeekDates, getTodayStr } from "@/lib/dateUtils";
import { STORAGE_KEY, SUMMARY_STORAGE_KEY } from "@/lib/constants";

export function useDashboardData() {
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    if (typeof window === "undefined") return initialDrivers;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialDrivers;
    } catch {
      return initialDrivers;
    }
  });
  const [week, setWeek] = useState<{ start: string; end: string }>(getDefaultWeek);
  const [summary, setSummary] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(SUMMARY_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [editingSummary, setEditingSummary] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem(SUMMARY_STORAGE_KEY);
      return !saved || saved.trim() === "";
    } catch {
      return true;
    }
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDriverName, setNewDriverName] = useState("");
  const [selectedDayIdx, setSelectedDayIdx] = useState(() => {
    const today = getTodayStr();
    const dates = getWeekDates(getDefaultWeek().start, getDefaultWeek().end);
    const idx = dates.indexOf(today);
    return idx >= 0 ? idx : 0;
  });

  const weekDates = useMemo(() => getWeekDates(week.start, week.end), [week]);
  const effectiveDayIdx =
    selectedDayIdx < weekDates.length ? selectedDayIdx : 0;
  const selectedDate = weekDates[effectiveDayIdx] || week.start;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(SUMMARY_STORAGE_KEY, summary);
  }, [summary]);

  const getDriverDay = (driver: Driver, date: string) =>
    driver.days?.[date] || emptyDay();

  const toggleVehicleAssigned = (id: number, date: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const day = getDriverDay(d, date);
        return {
          ...d,
          days: {
            ...d.days,
            [date]: {
              ...day,
              vehicleAssigned: !day.vehicleAssigned,
              vehicleReason: !day.vehicleAssigned ? "" : day.vehicleReason,
            },
          },
        };
      })
    );
  };

  const toggleFollowedPlan = (id: number, date: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const day = getDriverDay(d, date);
        return {
          ...d,
          days: {
            ...d.days,
            [date]: {
              ...day,
              followedPlan: !day.followedPlan,
              planReason: !day.followedPlan ? "" : day.planReason,
            },
          },
        };
      })
    );
  };

  const updateReason = (
    id: number,
    date: string,
    field: "vehicleReason" | "planReason",
    value: string
  ) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const day = getDriverDay(d, date);
        return {
          ...d,
          days: {
            ...d.days,
            [date]: { ...day, [field]: value },
          },
        };
      })
    );
  };

  const toggleWorked = (driverId: number, date: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== driverId) return d;
        const current = d.workedDays?.[date] ?? false;
        return {
          ...d,
          workedDays: { ...d.workedDays, [date]: !current },
        };
      })
    );
  };

  const handleAddDriver = () => {
    if (newDriverName.trim() === "") return;
    const newId =
      drivers.length > 0 ? Math.max(...drivers.map((d) => d.id)) + 1 : 1;
    setDrivers((prev) => [
      ...prev,
      {
        id: newId,
        name: newDriverName.trim(),
        workedDays: {},
        days: {},
      },
    ]);
    setNewDriverName("");
    setDialogOpen(false);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SUMMARY_STORAGE_KEY);
    setDrivers(initialDrivers);
    setWeek(getDefaultWeek());
    setSummary("");
    setEditingSummary(true);
    setSelectedDayIdx(0);
  };

  const getWorkedDates = (d: Driver) =>
    weekDates.filter((date) => d.workedDays?.[date]);

  const driversWhoWorked = drivers.filter(
    (d) => getWorkedDates(d).length > 0
  );
  const vehicleYes = driversWhoWorked.filter((d) =>
    getWorkedDates(d).every((date) => d.days?.[date]?.vehicleAssigned)
  ).length;
  const planYes = driversWhoWorked.filter((d) =>
    getWorkedDates(d).every((date) => d.days?.[date]?.followedPlan)
  ).length;
  const vehicleNo = driversWhoWorked.length - vehicleYes;
  const planNo = driversWhoWorked.length - planYes;

  return {
    drivers,
    week,
    setWeek,
    summary,
    setSummary,
    editingSummary,
    setEditingSummary,
    dialogOpen,
    setDialogOpen,
    newDriverName,
    setNewDriverName,
    weekDates,
    selectedDayIdx: effectiveDayIdx,
    setSelectedDayIdx,
    selectedDate,
    toggleVehicleAssigned,
    toggleFollowedPlan,
    updateReason,
    toggleWorked,
    handleAddDriver,
    handleReset,
    driversWhoWorkedCount: driversWhoWorked.length,
    vehicleYes,
    planYes,
    vehicleNo,
    planNo,
  };
}
