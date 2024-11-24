"use client";
import { useState, useEffect } from "react";
import { Case } from "../components/pages/Home";

// Interface for storing daily cases
interface DailyEntries {
  [date: string]: Case[];
}

// Utility function to get today's date in YYYY-MM-DD format
function getTodayKey(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Function to load entries from localStorage
function loadEntriesFromLocalStorage(): DailyEntries {
  const storedEntries = localStorage.getItem("dailyEntries");
  return storedEntries ? JSON.parse(storedEntries) : {};
}

// Function to save entries to localStorage
function saveEntriesToLocalStorage(entries: DailyEntries) {
  localStorage.setItem("dailyEntries", JSON.stringify(entries));
}

export function useDailyEntries(initialCases: Case[]) {
  // State to store all daily entries
  const [dailyEntries, setDailyEntries] = useState<DailyEntries>(() => {
    if (typeof window !== "undefined") {
      return loadEntriesFromLocalStorage();
    }
    return {};
  });

  // State for current day's cases
  const [allCases, setAllCases] = useState<Case[]>(() => {
    const todayKey = getTodayKey();

    // If today's entries exist in storage, use those
    if (dailyEntries[todayKey]) {
      return dailyEntries[todayKey];
    }

    // Otherwise, use initial cases or empty array
    return initialCases;
  });

  useEffect(() => {
    const todayKey = getTodayKey();
    const updatedEntries = {
      ...dailyEntries,
      [todayKey]: allCases,
    };

    // Debounce the localStorage update
    const timeoutId = setTimeout(() => {
      setDailyEntries(updatedEntries);
      saveEntriesToLocalStorage(updatedEntries);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [allCases]);

  const deleteCase = (id: string) => {
    // Load entries from localStorage
    const storedEntries = loadEntriesFromLocalStorage();

    // Clone the entries object to avoid mutating state
    const updatedEntries = { ...storedEntries };

    // Loop through all date keys and remove the case with the given ID
    Object.keys(updatedEntries).forEach((dateKey) => {
      updatedEntries[dateKey] = updatedEntries[dateKey].filter(
        (caseItem: Case) => caseItem.id !== id
      );
    });

    // Save updated entries to localStorage
    saveEntriesToLocalStorage(updatedEntries);

    // Update state
    setDailyEntries(updatedEntries);

    // Optional: If you need to update `allCases`, recompute from `updatedEntries`
    const allCases = Object.values(updatedEntries).flat();
    setAllCases(allCases);
  };

  const editCase = (updatedCase: Case) => {
    // Load entries from localStorage
    const storedEntries = loadEntriesFromLocalStorage();

    // Clone the entries object to avoid mutating state
    const updatedEntries = { ...storedEntries };

    // Loop through all date keys and update the case with the same ID
    Object.keys(updatedEntries).forEach((dateKey) => {
      updatedEntries[dateKey] = updatedEntries[dateKey].map((caseItem: Case) =>
        caseItem.id === updatedCase.id ? updatedCase : caseItem
      );
    });

    // Save updated entries to localStorage
    saveEntriesToLocalStorage(updatedEntries);

    // Update state
    setDailyEntries(updatedEntries);

    // Optional: If you need to update `allCases`, recompute from `updatedEntries`
    const allCases = Object.values(updatedEntries).flat();
    setAllCases(allCases);
  };

  const refreshCases = () => {
    const todayKey = getTodayKey();
    const updatedEntries = loadEntriesFromLocalStorage();
    const todayCases = updatedEntries[todayKey];
    setAllCases(todayCases);
  };

  const refreshCasesForDate = (date: string) => {
    const casesForDate = dailyEntries[date] || [];
    setAllCases(casesForDate);
  };

  const calculateTotalTime = (startTime: string, endTime: string) => {
    if (startTime === "--:--" || endTime === "--:--") {
      return "--:--:--";
    }
    const [startHours, startMinutes, startSeconds] = startTime
      .split(":")
      .map(Number);
    const [endHours, endMinutes, endSeconds] = endTime.split(":").map(Number);

    const startDate = new Date();
    const endDate = new Date();

    startDate.setHours(startHours, startMinutes, startSeconds || 0);
    endDate.setHours(endHours, endMinutes, endSeconds || 0);

    const diffInMilliseconds = endDate.getTime() - startDate.getTime();

    if (diffInMilliseconds < 0) {
      return "00:00:00"; // Handle cases where the end time is earlier than the start time
    }

    const totalSeconds = Math.floor(diffInMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  // Function to reset today's entries
  const setNewDay = () => {
    const todayKey = getTodayKey();

    // Remove today's entries
    const updatedEntries = { ...dailyEntries };
    delete updatedEntries[todayKey];

    setDailyEntries(updatedEntries);
    saveEntriesToLocalStorage(updatedEntries);

    // Reset to initial cases
    setAllCases(initialCases);
  };
  // Function to get entries for a specific date
  const getEntriesForDate = (date: string) => {
    return dailyEntries[date] || [];
  };

  // Function to get all available dates
  const getAvailableDates = () => {
    return Object.keys(dailyEntries).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  };

  return {
    allCases,
    setAllCases,
    setNewDay,
    getEntriesForDate,
    getAvailableDates,
    refreshCasesForDate,
    refreshCases,
    deleteCase,
    calculateTotalTime,
    editCase,
    dailyEntries,
  };
}
