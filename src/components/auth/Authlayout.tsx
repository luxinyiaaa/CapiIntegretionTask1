// components/auth/AuthLayout.tsx
import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      minH="100vh"
      bg="bg.canvas"
      w="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 6 }} // 手机左右留白
      py={{ base: 10, md: 0 }}
    >
      {children}
    </Box>
  );
}
