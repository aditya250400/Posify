import { create } from "zustand";

export const useLoading = create((set) => ({
  loading: true,
  setLoading: (value) => set({ loading: value }),
}));
