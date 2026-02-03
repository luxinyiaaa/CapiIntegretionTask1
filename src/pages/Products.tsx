import { AppLayout } from "@/components/layout/AppLayout";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { ProductsContent } from "@/components/products/ProductsContent";
import { Box, VStack } from "@chakra-ui/react";
import { useState } from "react";

export type ProductsViewMode = "grid" | "list";

export default function ProductsPage() {
  const [view, setView] = useState<ProductsViewMode>("grid");

  return (
    <AppLayout title="Products">
      <Box bg="bg.dashboard" minH="dvh" w="full">
        <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
          <Box w="full" maxW={{ base: "full" }} mx="auto">
            <VStack align="stretch" gap={{ base: 4, md: 6 }}>
              <ProductsHeader view={view} onChangeView={setView} />
              <ProductsContent view={view} />
            </VStack>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  );
}
