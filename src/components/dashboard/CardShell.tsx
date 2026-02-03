import { type BoxProps } from "@chakra-ui/react";
import { Surface } from "@/components/ui/Surface";

export function CardShell(props: BoxProps) {
  return <Surface h="full" p={{ base: 4, md: 6 }} {...props} />;
}
