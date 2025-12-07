import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Custom plugin to make CSS load asynchronously (non-render-blocking)
function asyncCssPlugin(): Plugin {
  return {
    name: 'async-css',
    enforce: 'post',
    transformIndexHtml(html) {
      // Convert CSS links to async loading pattern
      // Uses media="print" onload="this.media='all'" trick
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        `<link rel="stylesheet" href="$1" media="print" onload="this.media='all'" data-async>
    <noscript><link rel="stylesheet" href="$1"></noscript>`
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && asyncCssPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
          'vendor-charts': ['recharts'],
          'vendor-animations': ['framer-motion'],
        },
      },
    },
    // Use esbuild for minification (built into Vite, faster than terser)
    minify: 'esbuild',
    // Generate source maps only in development
    sourcemap: mode === 'development',
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    // CSS code splitting for better loading
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
