import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [react(), svgr()],
  root: ".",
  publicDir: "public",
  resolve: {
    alias: {
      "@/components/ui/input": path.resolve(__dirname, "src/ui/Input"),
      "@/lib": path.resolve(__dirname, "src/lib"),
      "@/assets": path.resolve(__dirname, "src/assets"),
      "@/components/icon": path.resolve(__dirname, "src/ui/Icon"),
      "@/components/ui/button": path.resolve(__dirname, "src/ui/Button"),
      "@/components/ui/card": path.resolve(__dirname, "src/ui/Card"),
      "@/components/ui/typography": path.resolve(__dirname, "src/ui"),
      "@/components/ui/select": path.resolve(__dirname, "src/ui/Select"),
      "@/components/ui/dialog": path.resolve(__dirname, "src/ui/Dialog"),
      "@/components/ui/popover": path.resolve(__dirname, "src/ui/Popover"),
      "@/components/ui/switch": path.resolve(__dirname, "src/ui/Switch"),
      "@/utils": path.resolve(__dirname, "src/lib"),
    },
  },
});
