import { Badge, Box, HStack, Text, type BoxProps } from "@chakra-ui/react";
import { Surface } from "@/components/ui/Surface";
import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  delta?: string; // +20% 可选
  icon?: ReactNode; // 你要的图标（可选）
  tone?: "success" | "neutral"; // 以后想区分颜色也方便
  size?: "md" | "sm"; // ✅ Row1 用 md，Row2 用 sm
} & BoxProps;

export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "success",
  size = "md",
  ...rest
}: StatCardProps) {
  const isSm = size === "sm";

  const iconBg = tone === "success" ? "green.100" : "gray.100";
  const badgeBg = tone === "success" ? "green.100" : "gray.100";
  const badgeColor = tone === "success" ? "green.700" : "gray.700";

  return (
    <Surface p={isSm ? { base: 4 } : { base: 4, md: 5 }} {...rest}>
      <HStack gap={3} align="start">
        {/* Icon circle */}
        <Box
          w={isSm ? "36px" : "40px"}
          h={isSm ? "36px" : "40px"}
          borderRadius="full"
          bg={iconBg}
          display="grid"
          placeItems="center"
          flexShrink={0}
        >
          {icon}
        </Box>

        <Box minW={0}>
          <HStack gap={2} wrap="wrap">
            <Text fontWeight="600" fontSize={isSm ? "md" : "md"}>
              {value}
            </Text>

            {delta ? (
              <Badge
                bg={badgeBg}
                color={badgeColor}
                borderRadius="full"
                px={2}
                fontSize="xs"
              >
                {delta}
              </Badge>
            ) : null}
          </HStack>

          <Text
            fontSize="sm"
            color="text.muted"
            lineClamp={1}
            mt={isSm ? 0 : 0}
          >
            {label}
          </Text>
        </Box>
      </HStack>
    </Surface>
  );
}
