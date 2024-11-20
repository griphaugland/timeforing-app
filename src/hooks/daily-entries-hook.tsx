"use client";
import { useState, useEffect } from "react";
import { Case } from "@/app/page";

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

  // Effect to update localStorage whenever cases change
  useEffect(() => {
    const todayKey = getTodayKey();

    // Update the entries for today
    const updatedEntries = {
      ...dailyEntries,
      [todayKey]: allCases,
    };

    setDailyEntries(updatedEntries);
    saveEntriesToLocalStorage(updatedEntries);
  }, [allCases]);

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
    dailyEntries,
  };
}
