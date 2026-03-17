"use client";

import { useState, useEffect, useMemo } from "react";
import { Driver, emptyDay } from "@/types";
import { getDefaultWeek, getWeekDates, getTodayStr } from "@/lib/dateUtils";
import { supabase } from "@/lib/supabase";

type DriverDayRow = {
  driver_id: number;
  date: string;
  worked: boolean;
  vehicle_assigned: boolean;
  followed_plan: boolean;
  vehicle_reason: string;
  plan_reason: string;
};

function rowsToDrivers(
  driverRows: { id: number; name: string }[],
  dayRows: DriverDayRow[]
): Driver[] {
  return driverRows.map((dr) => {
    const days: Driver["days"] = {};
    const workedDays: Driver["workedDays"] = {};
    dayRows
      .filter((row) => row.driver_id === dr.id)
      .forEach((row) => {
        workedDays[row.date] = row.worked;
        days[row.date] = {
          vehicleAssigned: row.vehicle_assigned,
          followedPlan: row.followed_plan,
          vehicleReason: row.vehicle_reason,
          planReason: row.plan_reason,
        };
      });
    return { id: dr.id, name: dr.name, workedDays, days };
  });
}

export function useDashboardData() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [week, setWeek] = useState<{ start: string; end: string }>(getDefaultWeek);
  const [summary, setSummary] = useState<string>("");
  const [editingSummary, setEditingSummary] = useState(true);
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

  // Load drivers + all day entries once (and on reset)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [{ data: driverRows }, { data: dayRows }] = await Promise.all([
        supabase.from("drivers").select("id, name").order("id"),
        supabase.from("driver_days").select("*"),
      ]);
      if (cancelled) return;
      if (driverRows) {
        setDrivers(rowsToDrivers(driverRows, (dayRows as DriverDayRow[]) ?? []));
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  // Load summary for the selected week (re-runs on week change)
  useEffect(() => {
    let cancelled = false;
    async function loadSummary() {
      const { data } = await supabase
        .from("summaries")
        .select("text")
        .eq("week_start", week.start)
        .maybeSingle();
      if (cancelled) return;
      setSummary(data?.text ?? "");
      setEditingSummary(!data?.text?.trim());
    }
    loadSummary();
    return () => { cancelled = true; };
  }, [week.start, refreshKey]);

  // Real-time: driver_days changes
  useEffect(() => {
    const channel = supabase
      .channel("realtime_driver_days")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "driver_days" },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const row = payload.new as DriverDayRow;
            setDrivers((prev) =>
              prev.map((d) => {
                if (d.id !== row.driver_id) return d;
                return {
                  ...d,
                  workedDays: { ...d.workedDays, [row.date]: row.worked },
                  days: {
                    ...d.days,
                    [row.date]: {
                      vehicleAssigned: row.vehicle_assigned,
                      followedPlan: row.followed_plan,
                      vehicleReason: row.vehicle_reason,
                      planReason: row.plan_reason,
                    },
                  },
                };
              })
            );
          } else if (payload.eventType === "DELETE") {
            const row = payload.old as Partial<DriverDayRow>;
            if (!row.driver_id || !row.date) return;
            setDrivers((prev) =>
              prev.map((d) => {
                if (d.id !== row.driver_id) return d;
                const { [row.date!]: _w, ...workedDays } = d.workedDays ?? {};
                const { [row.date!]: _d, ...days } = d.days ?? {};
                return { ...d, workedDays, days };
              })
            );
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Real-time: new drivers added
  useEffect(() => {
    const channel = supabase
      .channel("realtime_drivers")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "drivers" },
        (payload) => {
          const row = payload.new as { id: number; name: string };
          setDrivers((prev) => {
            if (prev.some((d) => d.id === row.id)) return prev;
            return [...prev, { id: row.id, name: row.name, workedDays: {}, days: {} }];
          });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Real-time: summary changes for the current week
  useEffect(() => {
    const channel = supabase
      .channel("realtime_summaries")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "summaries" },
        (payload) => {
          if (payload.eventType === "DELETE") return;
          const row = payload.new as { week_start: string; text: string };
          if (row.week_start === week.start) {
            setSummary(row.text ?? "");
            setEditingSummary(!row.text?.trim());
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [week.start]);

  const getDriverDay = (driver: Driver, date: string) =>
    driver.days?.[date] || emptyDay();

  const upsertDay = async (driverId: number, date: string, patch: Partial<DriverDayRow>) => {
    const driver = drivers.find((d) => d.id === driverId);
    const existing = driver?.days?.[date];
    const row: DriverDayRow = {
      driver_id: driverId,
      date,
      worked: driver?.workedDays?.[date] ?? false,
      vehicle_assigned: existing?.vehicleAssigned ?? false,
      followed_plan: existing?.followedPlan ?? false,
      vehicle_reason: existing?.vehicleReason ?? "",
      plan_reason: existing?.planReason ?? "",
      ...patch,
    };
    await supabase
      .from("driver_days")
      .upsert(row, { onConflict: "driver_id,date" });
  };

  const toggleVehicleAssigned = async (id: number, date: string) => {
    const driver = drivers.find((d) => d.id === id);
    if (!driver) return;
    const day = getDriverDay(driver, date);
    const newVal = !day.vehicleAssigned;
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          days: {
            ...d.days,
            [date]: {
              ...day,
              vehicleAssigned: newVal,
              vehicleReason: newVal ? "" : day.vehicleReason,
            },
          },
        };
      })
    );
    await upsertDay(id, date, {
      vehicle_assigned: newVal,
      vehicle_reason: newVal ? "" : day.vehicleReason,
    });
  };

  const toggleFollowedPlan = async (id: number, date: string) => {
    const driver = drivers.find((d) => d.id === id);
    if (!driver) return;
    const day = getDriverDay(driver, date);
    const newVal = !day.followedPlan;
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          days: {
            ...d.days,
            [date]: {
              ...day,
              followedPlan: newVal,
              planReason: newVal ? "" : day.planReason,
            },
          },
        };
      })
    );
    await upsertDay(id, date, {
      followed_plan: newVal,
      plan_reason: newVal ? "" : day.planReason,
    });
  };

  const updateReason = async (
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
          days: { ...d.days, [date]: { ...day, [field]: value } },
        };
      })
    );
    const dbField = field === "vehicleReason" ? "vehicle_reason" : "plan_reason";
    await upsertDay(id, date, { [dbField]: value });
  };

  const toggleWorked = async (driverId: number, date: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;
    const newVal = !(driver.workedDays?.[date] ?? false);
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== driverId) return d;
        return { ...d, workedDays: { ...d.workedDays, [date]: newVal } };
      })
    );
    await upsertDay(driverId, date, { worked: newVal });
  };

  const handleAddDriver = async () => {
    if (newDriverName.trim() === "") return;
    const { data } = await supabase
      .from("drivers")
      .insert({ name: newDriverName.trim() })
      .select("id, name")
      .single();
    if (data) {
      setDrivers((prev) => {
        if (prev.some((d) => d.id === data.id)) return prev;
        return [...prev, { id: data.id, name: data.name, workedDays: {}, days: {} }];
      });
    }
    setNewDriverName("");
    setDialogOpen(false);
  };

  const saveSummary = async (text: string) => {
    setSummary(text);
    setEditingSummary(!text.trim());
    await supabase
      .from("summaries")
      .upsert({ week_start: week.start, text }, { onConflict: "week_start" });
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
    loading,
    week,
    setWeek,
    summary,
    setSummary: saveSummary,
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
    driversWhoWorkedCount: driversWhoWorked.length,
    vehicleYes,
    planYes,
    vehicleNo,
    planNo,
  };
}
