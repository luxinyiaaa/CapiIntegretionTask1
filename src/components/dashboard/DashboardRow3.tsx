import {
  Box,
  Button,
  Circle,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CardShell } from "@/components/dashboard/CardShell";
import userGreen from "@/assets/dashboard/userGreen.svg";
import userRed from "@/assets/dashboard/userRed.svg";
import userPurple from "@/assets/dashboard/userPurple.svg";
import userBlue from "@/assets/dashboard/userBlue.svg";
import topAdmin from "@/assets/dashboard/topAdmin.svg";

type Person = {
  name: string;
  company: string;
  listing: string;
  avatar?: string; // svg 路径
};

const topUsers: Person[] = [
  {
    name: "Rose Meadows",
    company: "Company name",
    listing: "Listing #2464",
    avatar: userGreen,
  },
  {
    name: "Madden Esparza",
    company: "Company name",
    listing: "Listing #6345",
    avatar: userRed,
  },
  {
    name: "Edison Norman",
    company: "Company name",
    listing: "Listing #9815",
    avatar: userPurple,
  },
  {
    name: "Terrance Conner",
    company: "Company name",
    listing: "Listing #9245",
    avatar: userBlue,
  },
];

function SectionHeader({ title }: { title: string }) {
  return (
    <Flex align="center" justify="space-between" mb={3}>
      <Text fontSize="lg" fontWeight="semibold">
        {title}
      </Text>
      <Text
        fontSize="sm"
        color="text.muted"
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
      >
        View all
      </Text>
    </Flex>
  );
}

function MiniAvatar({ src }: { src?: string }) {
  return (
    <Circle size={{ base: "36px", md: "40px" }} overflow="hidden">
      <Image
        src={src}
        alt=""
        boxSize={{ base: "18px", md: "20px" }}
        objectFit="contain"
      />
    </Circle>
  );
}

function PeopleList({ items }: { items: Person[] }) {
  return (
    <VStack align="stretch" gap={{ base: 3, md: 4 }}>
      {items.map((p) => (
        <Flex
          key={p.listing}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          gap={3}
          wrap={{ base: "wrap", md: "wrap" }}
        >
          <HStack gap={3} minW={0} flex="1">
            <MiniAvatar src={p.avatar} />

            <Box minW={0} flex="1">
              <Text fontWeight="medium">{p.name}</Text>
              <Text fontSize="sm" color="text.muted">
                {p.company}
              </Text>
            </Box>
          </HStack>

          <Text
            fontSize="sm"
            color="text.muted"
            flexShrink={0}
            w={{ base: "full", md: "auto" }} //  小屏另起一行
            textAlign={{ base: "left", md: "right" }}
          >
            {p.listing}
          </Text>
        </Flex>
      ))}
    </VStack>
  );
}

function TopAdminCard() {
  return (
    <CardShell>
      <SectionHeader title="Top Admin" />

      <Flex
        direction="row"
        wrap="wrap"
        gap={4}
        align={{ base: "stretch", md: "center" }}
      >
        {/* 左：头像 + 名字 */}
        <HStack gap={3}>
          <Circle
            size={{ base: "56px", md: "64px" }}
            bg="bg.surface"
            borderWidth="1px"
            borderColor="border.default"
            overflow="hidden"
          >
            <Image
              src={topAdmin}
              alt="Top admin"
              boxSize={{ base: "56px", md: "64px" }}
              objectFit="cover"
            />
          </Circle>

          <Box flex="1" minW={0}>
            <Text fontWeight="semibold" lineClamp={2} minW={0}>
              Carl Meadows
            </Text>
            <Text fontSize="sm" color="text.muted">
              Admin
            </Text>
          </Box>
        </HStack>

        {/* 右：指标 + 按钮 */}
        <VStack align="stretch" gap={3} flex="1" minW="100px">
          <Flex
            align="center"
            justify="space-between"
            gap={3}
            minW={0}
            bg="bg.surface"
            borderWidth="1px"
            borderColor="border.default"
            borderRadius="md"
            px={{ base: 3, md: 4 }}
            py={{ base: 2.5, md: 3 }}
          >
            <Text fontSize="sm" color="text.muted" minW={0} lineClamp={2}>
              Notices Reviewed:
            </Text>
            <Text fontWeight="semibold">23,353</Text>
          </Flex>

          <Button
            w="100%"
            bg="brand.primary"
            color="black"
            _hover={{ opacity: 0.9 }}
            borderRadius="md"
          >
            View Details
          </Button>
        </VStack>
      </Flex>
    </CardShell>
  );
}

export function DashboardRow3() {
  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
      gap={{ base: 4, md: 6 }}
    >
      {/* 左：Top 5 Users */}
      <GridItem minW={0}>
        <CardShell>
          <SectionHeader title="Top 5 Users" />
          <PeopleList items={topUsers} />
        </CardShell>
      </GridItem>

      {/* 中：Top 5 Fake Sellers */}
      <GridItem minW={0}>
        <CardShell>
          <SectionHeader title="Top 5 Fake Sellers" />
          <PeopleList items={topUsers} />
        </CardShell>
      </GridItem>

      {/* 右：Top Admin */}
      <GridItem minW={0}>
        <TopAdminCard />
      </GridItem>
    </Grid>
  );
}
