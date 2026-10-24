import { useEffect, useState } from "react";
import type { HomeData } from "../types";

export const HOME_CACHE_KEY = "epfk-organizer:home-data-cache";

export function loadHomeCache(storageKey = HOME_CACHE_KEY): HomeData | null {
  try {
    const item = localStorage.getItem(storageKey);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (parsed && parsed.date) {
      parsed.date = new Date(parsed.date);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveHomeCache(data: HomeData, storageKey = HOME_CACHE_KEY) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (e) {
    console.error("Не вдалося зберегти кеш Головної:", e);
  }
}

export function useCachedHomeData(
  remoteData: HomeData | null,
  storageKey = HOME_CACHE_KEY,
) {
  const [cachedData] = useState<HomeData | null>(() =>
    loadHomeCache(storageKey),
  );
  const dataToRender = remoteData ?? cachedData;

  useEffect(() => {
    if (remoteData) saveHomeCache(remoteData, storageKey);
  }, [remoteData, storageKey]);

  return {
    data: dataToRender,
    remoteData,
    cachedData,
    isLoaded: dataToRender !== null,
  };
}
