// src/theme/system.ts（只展示需要改的部分）
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      radii: {
        card: { value: "16px" }, // Login 卡片
        input: { value: "8px" }, // Input
        button: { value: "8px" }, // Button
      },
      sizes: {
        input: { value: "45px" }, // Input height
        button: { value: "40px" }, // Button height
      },
      shadows: {
        card: {
          value: "0 8px 24px rgba(0, 0, 0, 0.12)", // drop shadow（接近 Figma）
        },
      },

      colors: {
        brand: {
          primary: { value: "#C9F8C1" }, // button.primary
        },
        gray: {
          50: { value: "#FFFFFF" }, // bg.canvas
          100: { value: "#F0F0F0" }, // bg.surface / border.default
          900: { value: "#0D0D0D" }, // text.primary
          600: { value: "#808080" }, // text.muted
          150: { value: "#F7F8FB" }, //dashboar background bg.dashboard
        },
      },
    },

    semanticTokens: {
      colors: {
        "button.primary": {
          value: {
            base: "{colors.brand.primary}",
            _dark: "{colors.brand.primary}",
          },
        },
        "bg.canvas": {
          value: { base: "{colors.gray.50}", _dark: "#0D0D0D" },
        },
        "bg.surface": {
          value: { base: "{colors.gray.100}", _dark: "#1A1A1A" },
        },
        "bg.dashboard": {
          value: { base: "colors.gray.150", _dark: "#0F172A" },
        },
        "text.primary": {
          value: { base: "{colors.gray.900}", _dark: "#FFFFFF" },
        },
        "text.muted": {
          value: { base: "{colors.gray.600}", _dark: "rgba(255,255,255,0.7)" },
        },
        "border.default": {
          value: { base: "{colors.gray.100}", _dark: "rgba(255,255,255,0.15)" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
