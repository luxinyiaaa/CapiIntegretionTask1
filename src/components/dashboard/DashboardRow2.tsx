import {
  Badge,
  Grid,
  GridItem,
  Box,
  Flex,
  Text,
  Grid as ChakraGrid,
  Image,
} from "@chakra-ui/react";

import { UserOverviewChart } from "@/components/dashboard/UserOverviewChart";
import { RevenueOverviewChart } from "@/components/dashboard/RevenueOverviewChart";
import { StatCard } from "@/components/dashboard/StatsCard";
import icon2 from "@/assets/dashboard/icon2.svg";
import icon4 from "@/assets/dashboard/icon4.svg";

import { CardShell } from "@/components/dashboard/CardShell";

export function DashboardRow2() {
  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      gap={{ base: 4, md: 6 }}
    >
      {/* Left: User Overview */}
      <GridItem minW={0}>
        <CardShell>
          <Flex justify="space-between" mb={4}>
            <Box>
              <Text fontSize="xl" fontWeight="semibold">
                User Overview
              </Text>
              <Text fontSize="sm" color="text.muted">
                +25% compared to last 30 days
              </Text>
            </Box>
            <Badge variant="outline" px={3} py={1} borderRadius="input">
              This Week ▾
            </Badge>
          </Flex>

          <UserOverviewChart />

          <ChakraGrid
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={4}
            mt={4}
          >
            <StatCard
              size="sm"
              label="Earnings"
              value="€200.00"
              delta="+85%"
              icon={<Image src={icon4} alt="icon4" />}
            />
            <StatCard
              size="sm"
              label="Closed Offers"
              value="52"
              delta="+25%"
              icon={<Image src={icon2} alt="icon2" />}
            />
          </ChakraGrid>
        </CardShell>
      </GridItem>

      {/*Right: Revenue Overview */}
      <GridItem minW={0}>
        <CardShell>
          <Flex justify="space-between" mb={4}>
            <Box>
              <Text fontSize="xl" fontWeight="semibold">
                Revenue Overview
              </Text>
              <Text fontSize="sm" color="text.muted">
                +25% compared to last 30 days
              </Text>
            </Box>
            <Badge variant="outline" px={3} py={1} borderRadius="input">
              This Year ▾
            </Badge>
          </Flex>

          <RevenueOverviewChart />
        </CardShell>
      </GridItem>
    </Grid>
  );
}
