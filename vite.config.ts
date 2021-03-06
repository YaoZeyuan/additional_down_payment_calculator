import { build, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://cdn.jsdelivr.net/gh/YaoZeyuan/additional_down_payment_calculator@master/docs/",
  plugins: [react()],
  build: {
    "outDir": "docs",
  },
  resolve: {
    alias: [
      {
        "find": "~/src",
        "replacement": path.resolve(__dirname, "src")
      },
    ],
  },
})
