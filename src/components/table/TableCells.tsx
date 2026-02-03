import { Badge, Flex, Avatar, Box, Text } from "@chakra-ui/react";

const { Root: AvatarRoot, Image: AvatarImage } = Avatar;
export function Pill({
  colorPalette,
  children,
}: {
  colorPalette: "purple" | "green" | "red" | "gray";
  children: React.ReactNode;
}) {
  return (
    <Badge
      colorPalette={colorPalette}
      variant="subtle"
      borderRadius="full"
      px={3}
      py={1}
      fontWeight="medium"
      textTransform="none"
    >
      {children}
    </Badge>
  );
}

export function PersonCell({
  name,
  email,
  avatarSrc,
}: {
  name: string;
  email: string;
  avatarSrc?: string;
}) {
  return (
    <Flex align="center" gap={3} minW={0}>
      <AvatarRoot size="sm">
        <AvatarImage src={avatarSrc} alt={name} />
      </AvatarRoot>
      <Box minW={0}>
        <Text fontWeight="semibold" lineClamp={1}>
          {name}
        </Text>
        <Text fontSize="sm" color="text.muted" lineClamp={1}>
          {email}
        </Text>
      </Box>
    </Flex>
  );
}
