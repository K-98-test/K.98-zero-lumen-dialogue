import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',         // 루트 폴더가 프로젝트 최상위
  base: './',         // 상대 경로로 설정 (Vercel에서 흰 화면 방지)
  build: {
    outDir: 'dist'    // 빌드 결과 경로 (Vercel이 이걸 서빙)
  },
  plugins: [react()]
})
