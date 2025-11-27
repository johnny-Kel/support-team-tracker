import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// Vite configuration for React with path alias support
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Create @ alias for src/ directory
    // Allows: import Button from '@/components/Button'
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
