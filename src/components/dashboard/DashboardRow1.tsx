import { Box, Grid, HStack, SimpleGrid, Text, Image } from "@chakra-ui/react";
import { Surface } from "@/components/ui/Surface";
import { StatCard } from "@/components/dashboard/StatsCard";
import welcomeImg from "@/assets/dashboard/Welcome.svg";
import icon1 from "@/assets/dashboard/icon1.svg";
import icon2 from "@/assets/dashboard/icon2.svg";
import icon3 from "@/assets/dashboard/icon3.svg";
import icon4 from "@/assets/dashboard/icon4.svg";

function WelcomeCard() {
  return (
    <Surface p={0} overflow="hidden" h="full">
      <HStack h="full" gap={{ base: 4, md: 6 }} align="center">
        <Box
          flex={{ base: "0 0 40%", md: "0 0 42%" }}
          minW={{ base: "140px", md: "180px" }} // 防止太窄
        >
          <Image
            src={welcomeImg}
            alt="Welcome"
            w="100%"
            h="100%"
            objectFit="cover"
            display="block"
          />
        </Box>

        <Box>
          <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }} mb={1}>
            Ready to get started?
          </Text>
          <Text fontSize={{ base: "sm", md: "sm" }} color="text.muted">
            Take advantage of our platform and start onboarding affiliates
            today!
          </Text>
        </Box>
      </HStack>
    </Surface>
  );
}

export function DashboardRow1() {
  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      gap={{ base: 4, md: 6 }}
      alignItems="stretch"
    >
      <WelcomeCard />

      {/* 手机 1 列，>= sm 2 列（自动变 2x2） */}
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 3, md: 4 }}>
        <StatCard
          label="Yearly Earnings"
          value="€500.000"
          delta="+20%"
          icon={<Image src={icon4} alt="icon4" />}
        />
        <StatCard
          label="Revenue"
          value="€800.000"
          delta="+33%"
          icon={<Image src={icon2} alt="icon2" />}
        />
        <StatCard
          label="Closed Offers"
          value="52"
          delta="+20%"
          icon={<Image src={icon3} alt="icon3" />}
        />
        <StatCard
          label="Total Affiliates"
          value="125"
          delta="+20%"
          icon={<Image src={icon1} alt="icon1" />}
        />
      </SimpleGrid>
    </Grid>
  );
}
