// components/auth/AuthCard.tsx
import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <Box
      w="full"
      maxW={{ base: "full", sm: "520px", md: "608px" }} // 桌面贴合 Figma，手机不写死
      bg="bg.canvas"
      borderRadius="card"
      boxShadow="card"
      p={{ base: 6, md: "32px" }} // 手机24px，桌面32px
    >
      {children}
    </Box>
  );
}
