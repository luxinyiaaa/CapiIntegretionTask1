import { Badge, Box, Button, Flex, Image, Link, Text } from "@chakra-ui/react";

export function ProductCard({
  title,
  url,
  status,
  imageUrl,
}: {
  title: string;
  url: string;
  status: "Removed" | "Reminder Sent";
  imageUrl: string;
}) {
  return (
    <Box
      bg="bg.canvas"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="2xl"
      p={4}
    >
      <Box position="relative" borderRadius="2xl" overflow="hidden">
        <Image
          src={imageUrl}
          alt={title}
          w="full"
          h="180px"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top={3}
          left={3}
          px={3}
          py={1}
          borderRadius="full"
          bg="blackAlpha.400"
          color="white"
        >
          {status}
        </Badge>
      </Box>

      <Text mt={3} fontWeight="semibold">
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

      <Flex mt={4} justify="space-between" gap={3}>
        <Button size="sm" bg="button.primary" color="text.primary">
          View Details
        </Button>
        <Button size="sm" bg="black" color="white">
          Source
        </Button>
      </Flex>
    </Box>
  );
}
