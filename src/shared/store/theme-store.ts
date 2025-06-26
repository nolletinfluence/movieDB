import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeState {
  isDarkMode: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      toggleTheme: () => {
        const newTheme = !get().isDarkMode
        set({ isDarkMode: newTheme })
        if (typeof window !== "undefined") {
          if (newTheme) {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }
      },
      setTheme: (isDark: boolean) => {
        set({ isDarkMode: isDark })
        if (typeof window !== "undefined") {
          if (isDark) {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }
      },
    }),
    {
      name: "theme-storage",
    },
  ),
)
