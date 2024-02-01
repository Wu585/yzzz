import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import svgstore from 'vite-svg-sprite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgstore()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.31.110:8080/',
        // target: 'http://localhost:3000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/map": {
        // target: "http://172.21.15.67:8090",
        target: "http://36.152.38.212:8000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/map/, ""),
      },
    }
  }
})
