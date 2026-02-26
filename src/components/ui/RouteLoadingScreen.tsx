import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

type RouteLoadingScreenProps = {
  message?: string;
};

export function RouteLoadingScreen({
  message = "Loading...",
}: RouteLoadingScreenProps) {
  return (
    <Center
      minH="100dvh"
      bg="bg.dashboard"
      opacity={0}
      animation="fade-in 0.2s ease-out forwards"
      css={{
        "@keyframes fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <VStack gap={3}>
        <Spinner size="sm" />
        <Text color="text.muted">{message}</Text>
      </VStack>
    </Center>
  );
}
