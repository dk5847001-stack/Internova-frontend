import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const clientEnv = Object.entries(env)
    .filter(([key]) => key.startsWith("REACT_APP_"))
    .reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key]: value,
      }),
      {
        NODE_ENV: mode,
      }
    );

  return {
    plugins: [react()],
    envPrefix: ["VITE_", "REACT_APP_"],
    define: {
      "process.env": clientEnv,
    },
    esbuild: {
      // This repo keeps JSX in .js files, so match CRA's permissive handling.
      loader: "jsx",
      include: /src\/.*\.js$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
    build: {
      outDir: "build",
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.js",
    },
  };
});
