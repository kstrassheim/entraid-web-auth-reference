import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tfconfig from './terraform.config.json'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        // Apply logo flip on test and prod
        { src: `logo_src/(${tfconfig.env.value})/*.png`, dest: 'public' },
        { src: `logo_src/(${tfconfig.env.value})/favicon.ico`, dest: 'public' },
        { src: `logo_src/(${tfconfig.env.value})/logo.png`, dest: 'src/assets' }
      ]
    })
  ],
  base: "/",
  build: {
    outDir: '../backend/dist',
    emptyOutDir: true
  }
})