import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import svgstore from 'vite-svg-sprite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgstore()],
  server: {
    proxy: {
      '/api': {
        // target: 'http://192.168.31.110:8080/',
        // target: 'http://192.168.31.131:8180/',
        target: 'http://36.152.38.220:8180/',
        // target: 'http://localhost:3000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      '/apiView': {
        target: 'http://221.130.54.58:3000/',
        // target: 'http://localhost:3000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apiView/, ""),
      },
      '/data-api': {
        target: 'http://36.152.38.212:8050/',
        // target: "http://192.168.31.138:8050",
        // target: 'http://localhost:3000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data-api/, ""),
      },
      "/map": {
        // target: "http://172.21.15.67:8090",
        target: "http://36.152.38.212:8000",
        // target: "http://192.168.31.138:8000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/map/, ""),
      },
    }
  }
})
