import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
export default defineConfig({
  root: '.', // 또는 'src'가 아니라면 프로젝트 루트로 설정
  base:'./',
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
})
