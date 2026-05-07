import { create } from "zustand";

export const useLoading = create((set) => ({
  loading: false,
  setLoading: (value) => set({ loading: value }),
}));
