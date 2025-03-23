import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tfconfig from './terraform.config.json';
const env = tfconfig.env.value; 
const cacheBuster = new Date().getTime();// Default fallback
const envLogoPlugin = () => {
  return {
    name: 'html-env-plugin',
    transformIndexHtml(html) {
      const faviconPath = env === 'dev' 
        ? `/logo-dev.svg` 
        : env === 'test' 
          ? `/logo-test.svg` 
          : `/logo.svg`;
          
      const logoPath = env === 'dev' 
        ? `./assets/logo-dev.png` 
        : env === 'test' 
          ? `./assets/logo-test.png` 
          : `./assets/logo.png`;
      console.log(`Using favicon: ${faviconPath}`);
      console.log(`Using logo: ${logoPath}`);
      // Replace placeholders
      return html
        .replace(/{{FAVICON_PATH}}/g, faviconPath)
    },
    config(config) {
      // Define global variables for JavaScript files
      return {
        define: {
          '__APP_ENV__': JSON.stringify(env),
          '__LOGO_PATH__': JSON.stringify(env === 'dev' 
            ? `./assets/logo-dev.png` 
            : env === 'test' 
              ? `./assets/logo-test.png` 
              : `./assets/logo.png`),
          '__APP_VERSION__': JSON.stringify(cacheBuster)
        }
      };
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), envLogoPlugin()],
  base: "/",
  // Put the dist folder into the backend to enable easier deployment
  build: {
    outDir: '../backend/dist',
    emptyOutDir: true, // also necessary
  }
})

