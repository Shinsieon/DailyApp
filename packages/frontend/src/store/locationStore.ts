import { create } from "zustand";

export interface Location {
  latitude: number;
  longitude: number;
}

type LocationState = {
  location: Location | null;
  setLocation: (location: Location) => void;
  clearLocation: () => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  setLocation: (location: Location) => set({ location }),
  clearLocation: () => set({ location: null }),
}));
