import * as React from "react";
import { NavLink } from "react-router-dom";
import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { navItems } from "./nav";

type SidebarProps = {
  onNavigate?: () => void; // 手机 Drawer：点击导航后关闭
};

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <Box
      h="100%"
      w="100%"
      bg="bg.canvas"
      borderRightWidth="1px"
      borderColor="border.subtle"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 6 }}
    >
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        Intern Docs
      </Text>

      <Box h="1px" bg="border.subtle" mb={4} />

      <VStack align="stretch" gap={1}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={{ textDecoration: "none" }}
            onClick={onNavigate}
          >
            {({ isActive }) => (
              <HStack
                px={3}
                py={2.5}
                borderRadius="md"
                transition="all 0.15s"
                bg={isActive ? "bg.subtle" : "transparent"}
                _hover={{ bg: "bg.subtle" }}
              >
                <Image
                  src={item.icon}
                  boxSize={5}
                  color={isActive ? "fg" : "fg.muted"}
                />
                <Text
                  fontSize="sm"
                  fontWeight={isActive ? "semibold" : "medium"}
                  color="fg"
                >
                  {item.label}
                </Text>
              </HStack>
            )}
          </NavLink>
        ))}
      </VStack>
    </Box>
  );
}
