import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// On GitHub Actions, set base to "/<repo>/" so assets resolve on Pages
const isCI = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : '';

export default defineConfig({
  plugins: [react()],
  base: isCI && repoName ? `/${repoName}/` : '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5175,
    strictPort: true,
    // No backend server; proxy removed
  },
});
