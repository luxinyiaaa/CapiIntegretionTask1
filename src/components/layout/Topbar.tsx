import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  Text,
} from "@chakra-ui/react";

// import Avatar from "@chakra-ui/react";

import { FiMenu, FiChevronDown, FiLogOut } from "react-icons/fi";

import { ColorModeButton } from "@/components/ui/color-mode";
import { useAuth } from "@/context/useAuth";
import avatarSrc from "@/assets/UserImage.svg";

type TopbarProps = {
  title?: string;
  onOpenMenu?: () => void;
};

export function Topbar({ onOpenMenu }: TopbarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // TODO: 以后可以从 auth 的 user 里取
  const name = "Jane Cooper";
  const email = "janecooper@gmail.com";

  return (
    <Box
      w="full"
      flexShrink={0}
      alignSelf="stretch"
      bg="bg.canvas"
      borderBottomWidth="1px"
      borderColor="border.subtle"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex
        w="full"
        h={{ base: "56px", md: "62px" }}
        align="center"
        justify="space-between"
        px={{ base: 3, md: 6 }}
      >
        {/* 左侧：移动端菜单按钮 + 页面标题（可留着） */}
        <HStack gap={2} minW={0}>
          <IconButton
            aria-label="Open menu"
            variant="ghost"
            display={{ base: "inline-flex", md: "none" }}
            onClick={onOpenMenu}
          >
            <FiMenu />
          </IconButton>
        </HStack>

        {/* 右侧：Theme + 用户下拉 */}
        <HStack gap={{ base: 1, md: 2 }}>
          <ColorModeButton />

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                px={2}
                py={2}
                h="auto"
                _hover={{ bg: "bg.subtle" }}
                _active={{ bg: "bg.subtle" }}
              >
                <HStack gap={3} align="center">
                  <Avatar.Root size="sm">
                    <Avatar.Image src={avatarSrc} />
                    <Avatar.Fallback name={name} />
                  </Avatar.Root>

                  {/* 两行文字：桌面/平板显示，手机可隐藏 */}
                  <Box textAlign="left" display={{ base: "none", sm: "block" }}>
                    <Text fontWeight="semibold" lineHeight="1.1">
                      {name}
                    </Text>
                    <Text fontSize="sm" color="fg.muted" lineHeight="1.1">
                      {email}
                    </Text>
                  </Box>

                  <Box color="fg.muted">
                    <FiChevronDown />
                  </Box>
                </HStack>
              </Button>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content minW="220px">
                <Menu.Item value="logout" onClick={handleLogout}>
                  <HStack gap={2}>
                    <FiLogOut />
                    <Text>Logout</Text>
                  </HStack>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </HStack>
      </Flex>
    </Box>
  );
}
