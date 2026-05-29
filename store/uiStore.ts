import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  theme: "dark" | "light";
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  recentlyViewed: string[];
  compareList: string[];
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  addRecentlyViewed: (productId: string) => void;
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      searchOpen: false,
      mobileMenuOpen: false,
      recentlyViewed: [],
      compareList: [],

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setSearchOpen: (open) => set({ searchOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      addRecentlyViewed: (productId) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((id) => id !== productId);
          return { recentlyViewed: [productId, ...filtered].slice(0, 10) };
        });
      },

      addToCompare: (productId) => {
        set((state) => {
          if (state.compareList.includes(productId) || state.compareList.length >= 4) return state;
          return { compareList: [...state.compareList, productId] };
        });
      },

      removeFromCompare: (productId) => {
        set((state) => ({ compareList: state.compareList.filter((id) => id !== productId) }));
      },

      clearCompare: () => set({ compareList: [] }),
    }),
    { name: "mobilehub-ui", partialize: (state) => ({ theme: state.theme, recentlyViewed: state.recentlyViewed }) }
  )
);
