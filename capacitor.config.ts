import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "trainee-auth-ui",
  webDir: "dist",
  server: {
    // url: "http://localhost:5173",
    cleartext: true,
    androidScheme: "http",
    iosScheme: "http",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 4000,
      launchAutoHide: true,
      backgroundColor: "#f7fafc",
      showSpinner: false,
    },
  },
};

export default config;
