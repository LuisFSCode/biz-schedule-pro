import { createContext, useContext } from "react";
import { DashboardState } from "../hooks/DashboardHooks/DashboardHooks";

export const DashboardContext = createContext<any>(null);

export function DashboardProvider( { children }: { children: React.ReactNode }) {
  const state = DashboardState();
  return (
    <DashboardContext.Provider value={state} >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}