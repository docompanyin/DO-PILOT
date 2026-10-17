// @ts-nocheck
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import adminOtpHandler from "./api/admin-otp.js";

// Load .env into process.env for local Node dev middleware
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || "";
        val = val.trim().replace(/^['"](.*)['"]$/, "$1");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {
  // ignore
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "site-data-api-server",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/api/admin-otp")) {
            // Polyfill Express-like response helpers for Vite Connect dev server
            if (!res.status) {
              res.status = function(code) { res.statusCode = code; return res; };
            }
            if (!res.json) {
              res.json = function(data) {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
                return res;
              };
            }
            if (req.method === "OPTIONS") {
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
              res.statusCode = 200;
              res.end();
              return;
            }
            if (req.method === "GET") {
              adminOtpHandler(req, res).catch((err) => {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              });
              return;
            }
            if (req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => { body += chunk; });
              req.on("end", async () => {
                try {
                  req.body = body ? JSON.parse(body) : {};
                  await adminOtpHandler(req, res);
                } catch (err) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, message: err.message }));
                }
              });
              return;
            }
          }
          if (req.url === "/api/save-site-data") {
            if (req.method === "OPTIONS") {
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type");
              res.statusCode = 200;
              res.end();
              return;
            }
            if (req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => { body += chunk; });
              req.on("end", () => {
                try {
                  const parsed = JSON.parse(body);
                  const filePath = path.resolve(process.cwd(), "src/data/siteData.json");
                  fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf-8");
                  console.log("Successfully saved siteData.json to disk!");
                  res.setHeader("Access-Control-Allow-Origin", "*");
                  res.setHeader("Content-Type", "application/json");
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, message: "Site data saved permanently to disk!" }));
                } catch (err) {
                  console.error("Error writing siteData.json:", err);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, message: "Failed to write site data" }));
                }
              });
              return;
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three', 'three-stdlib'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'gsap': ['gsap'],
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['three', 'gsap', 'lenis']
  }
});
