import * as React from "react";
import { Box, Flex, Drawer, Portal } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AppLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

export function AppLayout({ title, children }: AppLayoutProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Flex minH="100vh" bg="bg.canvas" w="full">
      {/* Desktop Sidebar */}
      <Box w="190px" display={{ base: "none", md: "block" }} flexShrink={0}>
        <Sidebar />
      </Box>

      {/* Mobile Drawer Sidebar */}
      <Box display={{ base: "block", md: "none" }}>
        <Drawer.Root
          open={open}
          onOpenChange={(details) => setOpen(details.open)}
          placement="start"
          size="xs"
          lazyMount
          unmountOnExit
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Sidebar onNavigate={() => setOpen(false)} />
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Box>

      {/* Main */}
      <Flex direction="column" flex="1" minW={0}>
        <Box w="full" flexShrink={0}>
          <Topbar title={title} onOpenMenu={() => setOpen(true)} />
        </Box>

        <Box flex="1" px={{ base: 3, md: 6 }} py={{ base: 4, md: 6 }} minW={0}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
