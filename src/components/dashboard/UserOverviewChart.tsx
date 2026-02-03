import { Box, Text, useToken } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const data = [
  { day: "12 Aug", newClients: 220 },
  { day: "13 Aug", newClients: 410 },
  { day: "14 Aug", newClients: 398 },
  { day: "15 Aug", newClients: 120 },
  { day: "16 Aug", newClients: 110 },
  { day: "17 Aug", newClients: 250 },
  { day: "18 Aug", newClients: 320 },
];

const HIGHLIGHT_DAY = "14 Aug";

type TooltipPayload = { value?: number };
type BlackTooltipProps = { active?: boolean; payload?: TooltipPayload[] };

function BlackTooltip({ active, payload }: BlackTooltipProps) {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  return (
    <Box bg="black" color="white" px={4} py={3} borderRadius="lg" fontSize="sm">
      <Text fontWeight="semibold">{v}</Text>
      <Text opacity={0.85}>New Clients</Text>
    </Box>
  );
}

export function UserOverviewChart() {
  const [purple500] = useToken("colors", ["purple.500"]);

  return (
    <Box h="220px" w="full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={22}>
          <CartesianGrid strokeDasharray="4 6" vertical={false} />
          <XAxis
            dataKey="day"
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tickMargin={10} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={<BlackTooltip />}
          />
          <Bar dataKey="newClients" barSize={18} radius={[10, 10, 0, 0]}>
            {data.map((d) => (
              <Cell
                key={d.day}
                fill={purple500}
                opacity={d.day === HIGHLIGHT_DAY ? 1 : 0.18}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
