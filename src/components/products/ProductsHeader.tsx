import { Button, Flex, HStack, Text } from "@chakra-ui/react";
import type { ProductsViewMode } from "@/pages/Products";

export function ProductsHeader({
  view,
  onChangeView,
}: {
  view: ProductsViewMode;
  onChangeView: (v: ProductsViewMode) => void;
}) {
  return (
    <Flex align="center" justify="space-between" gap={4}>
      <Text fontSize="2xl" fontWeight="semibold">
        Products
      </Text>

      <HStack gap={2}>
        <Button
          size="sm"
          bg={view === "grid" ? "button.primary" : "bg.surface"}
          onClick={() => onChangeView("grid")}
          color="text.primary"
        >
          Grid View
        </Button>
        <Button
          size="sm"
          bg={view === "list" ? "button.primary" : "bg.surface"}
          onClick={() => onChangeView("list")}
          color="text.primary"
        >
          List View
        </Button>
      </HStack>
    </Flex>
  );
}
