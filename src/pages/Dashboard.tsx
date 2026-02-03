import { DashboardRow1 } from "@/components/dashboard/DashboardRow1";
import { DashboardRow2 } from "@/components/dashboard/DashboardRow2";
import { DashboardRow3 } from "@/components/dashboard/DashboardRow3";
import { AppLayout } from "@/components/layout/AppLayout";
import { Box, VStack, Text, Flex, Button, Icon } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard">
      <Box bg="bg.dashboard" minH="dvh" w="full">
        <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
          <Box w="full" maxW={{ base: "full" }} mx="auto">
            <VStack align="stretch" gap={{ base: 4, md: 6 }}>
              <Flex align="center" justify="space-between" mb={4}>
                <Text fontSize="2xl" fontWeight="semibold">
                  Users
                </Text>
                <Button
                  variant="solid"
                  bg="button.primary"
                  color="text.primary"
                  gap="2"
                >
                  <Icon as={FiPlus} />
                  Add New User
                </Button>
              </Flex>
              <DashboardRow1 />
              <DashboardRow2 />
              <DashboardRow3 />
            </VStack>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  );
}
