import { Box, useToken, Wrap, WrapItem, HStack, Text } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "12 Jan", earnings: 28000, revenue: 9000 },
  { day: "13 Jan", earnings: 21000, revenue: 16000 },
  { day: "14 Jan", earnings: 24000, revenue: 32000 },
  { day: "15 Jan", earnings: 23000, revenue: 21000 },
  { day: "16 Jan", earnings: 18000, revenue: 38000 },
];

export function RevenueOverviewChart() {
  const [purple500, green500] = useToken("colors", ["purple.500", "green.500"]);

  return (
    <Box h="300px" w="full" mb="4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 6" vertical={false} />
          <XAxis
            dataKey="day"
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tickMargin={10} axisLine={false} tickLine={false} />
          <Tooltip />

          {/* <Legend /> */}

          <Line
            // type="monotone"
            dataKey="earnings"
            stroke={purple500}
            strokeWidth={3}
            dot={false}
          />
          <Line
            // type="monotone"
            dataKey="revenue"
            stroke={green500}
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <Wrap
        gap={{ base: 4, md: 6 }}
        mt={{ base: 2, md: 3 }}
        px={{ base: 0, md: 1 }}
      >
        <WrapItem>
          <HStack gap={{ base: 2, md: 2.5 }}>
            <Box
              w="1.25em"
              h="0.45em"
              bg={purple500}
              borderRadius="full"
              flexShrink={0}
            />
            <Text fontSize={{ base: "sm", md: "sm" }} color="fg.muted">
              Earnings
            </Text>
          </HStack>
        </WrapItem>

        <WrapItem>
          <HStack gap={{ base: 2, md: 2.5 }}>
            <Box
              w="1.25em"
              h="0.45em"
              bg={green500}
              borderRadius="full"
              flexShrink={0}
            />
            <Text fontSize={{ base: "sm", md: "sm" }} color="fg.muted">
              Revenue
            </Text>
          </HStack>
        </WrapItem>
      </Wrap>
    </Box>
  );
}
