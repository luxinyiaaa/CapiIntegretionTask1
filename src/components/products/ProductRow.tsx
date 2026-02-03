import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";

export function ProductRow({
  imageUrl,
  title,
  url,
  status,
}: {
  imageUrl: string;
  title: string;
  url: string;
  status: "Removed" | "Reminder Sent";
}) {
  return (
    <Flex
      bg="bg.canvas"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="2xl"
      p={{ base: 3, md: 4 }}
      align="center"
      justify="space-between"
      gap={{ base: 3, md: 6 }}
      minW={0}
    >
      <HStack gap={4} minW={0} flex="1">
        <Image
          src={imageUrl}
          alt={title}
          w="56px"
          h="56px"
          borderRadius="xl"
          objectFit="cover"
          flexShrink={0}
        />

        <Box minW={0}>
          <Text fontWeight="semibold" lineClamp={1}>
            {title}
          </Text>

          <Link
            href={url}
            fontSize="sm"
            color="text.muted"
            display="block"
            maxW="full"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {url}
          </Link>
        </Box>

        {/* badge：桌面显示，小屏可隐藏（避免挤） */}
        <Box display={{ base: "none", md: "block" }} flexShrink={0}>
          <StatusBadge status={status} />
        </Box>
      </HStack>

      {/* 右侧按钮 */}
      <HStack gap={3} flexShrink={0}>
        <Button size="sm" bg="black" color="white">
          Source
        </Button>
        <Button size="sm" bg="button.primary" color="text.primary">
          View Details
        </Button>
      </HStack>
    </Flex>
  );
}

function StatusBadge({ status }: { status: "Removed" | "Reminder Sent" }) {
  if (status === "Reminder Sent") {
    return (
      <Badge
        px={3}
        py={1}
        borderRadius="full"
        bg="orange.100"
        color="orange.700"
      >
        Reminder Sent
      </Badge>
    );
  }
  return (
    <Badge px={3} py={1} borderRadius="full" bg="red.100" color="red.700">
      Removed
    </Badge>
  );
}
