import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  locations as initialLocations,
  type Location,
} from "../data/locations";

import { calculateRisk } from "../services/riskEngine";

import type { GeneratedAlert } from "../services/alertService";

interface AppContextType {
  locations: Location[];

  alerts: GeneratedAlert[];

  updateLocationRisk: (
    id: number,
    rainfall: number,
    soilMoisture: number,
    slope: number,
    historicalSusceptibility: number
  ) => void;

  addAlert: (alert: GeneratedAlert) => void;

  resolveAlert: (alertId: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locations, setLocations] =
    useState<Location[]>(initialLocations);

  const [alerts, setAlerts] =
    useState<GeneratedAlert[]>([]);

  // ==========================================
  // UPDATE LOCATION RISK
  // ==========================================

  const updateLocationRisk = (
    id: number,
    rainfall: number,
    soilMoisture: number,
    slope: number,
    historicalSusceptibility: number
  ) => {
    setLocations((currentLocations) =>
      currentLocations.map((location) => {
        if (location.id !== id) {
          return location;
        }

        // Calculate new risk
        const newRisk = calculateRisk({
          rainfall,
          soilMoisture,
          slope,
          historicalSusceptibility,
        });

        // ==========================================
        // AUTOMATIC ALERT FOR HIGH / CRITICAL RISK
        // ==========================================

        if (
          newRisk.level === "HIGH" ||
          newRisk.level === "CRITICAL"
        ) {
          const alert: GeneratedAlert = {
            id: Date.now(),
            locationId: location.id,
            locationName: location.name,
            state: location.state,
            level: newRisk.level,
            score: newRisk.score,

            message:
              newRisk.level === "CRITICAL"
                ? "Critical landslide conditions detected. Immediate field assessment and emergency preparedness are recommended."
                : "High landslide risk detected. Increased monitoring and precautionary action is recommended.",

            timestamp: new Date().toLocaleTimeString(),

            status: "ACTIVE",
          };

          // Add alert only if there isn't already
          // an active alert for this location
          setAlerts((currentAlerts) => {
            const alreadyActive = currentAlerts.some(
              (existingAlert) =>
                existingAlert.locationId === location.id &&
                existingAlert.status === "ACTIVE"
            );

            if (alreadyActive) {
              return currentAlerts;
            }

            return [
              alert,
              ...currentAlerts,
            ];
          });
        }

        // ==========================================
        // UPDATE LOCATION DATA
        // ==========================================

        return {
          ...location,

          rainfall,
          soilMoisture,
          slope,
          historicalSusceptibility,

          previousRisk: location.risk.score,

          risk: newRisk,
        };
      })
    );
  };

  // ==========================================
  // ADD ALERT
  // ==========================================

  const addAlert = (
    alert: GeneratedAlert
  ) => {
    setAlerts((currentAlerts) => {

      // Prevent duplicate ACTIVE alerts
      // for the same location
      const alreadyActive = currentAlerts.some(
        (existingAlert) =>
          existingAlert.locationId === alert.locationId &&
          existingAlert.status === "ACTIVE"
      );

      if (alreadyActive) {
        return currentAlerts;
      }

      return [
        alert,
        ...currentAlerts,
      ];
    });
  };

  // ==========================================
  // RESOLVE ALERT
  // ==========================================

  const resolveAlert = (
    alertId: number
  ) => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "RESOLVED",
            }
          : alert
      )
    );
  };

  // ==========================================
  // APP PROVIDER
  // ==========================================

  return (
    <AppContext.Provider
      value={{
        locations,
        alerts,
        updateLocationRisk,
        addAlert,
        resolveAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ==========================================
// USE APP STORE
// ==========================================

export function useAppStore() {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppStore must be used inside AppProvider"
    );
  }

  return context;
}