import { Grid, VStack } from "@chakra-ui/react";
import type { ProductsViewMode } from "@/pages/Products";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductRow } from "@/components/products/ProductRow";

import p1 from "@/assets/products/1.svg";
import p2 from "@/assets/products/2.svg";
import p3 from "@/assets/products/3.svg";
import p4 from "@/assets/products/4.svg";
import p5 from "@/assets/products/5.svg";
import p6 from "@/assets/products/6.svg";
import p7 from "@/assets/products/7.svg";
import p8 from "@/assets/products/8.svg";

const products = [
  { id: "1", imageUrl: p1, status: "Removed" as const },
  { id: "2", imageUrl: p2, status: "Removed" as const },
  { id: "3", imageUrl: p3, status: "Reminder Sent" as const },
  { id: "4", imageUrl: p4, status: "Removed" as const },
  { id: "5", imageUrl: p5, status: "Removed" as const },
  { id: "6", imageUrl: p6, status: "Removed" as const },
  { id: "7", imageUrl: p7, status: "Removed" as const },
  { id: "8", imageUrl: p8, status: "Removed" as const },
].map((p) => ({
  ...p,
  title: "Product title goes here",
  url: "https://yourproducturlgoeshere1122.com",
}));

export function ProductsContent({ view }: { view: ProductsViewMode }) {
  if (view === "list") {
    return (
      <VStack align="stretch" gap={{ base: 3, md: 4 }}>
        {products.map((p) => (
          <ProductRow
            key={p.id}
            imageUrl={p.imageUrl}
            title={p.title}
            url={p.url}
            status={p.status}
          />
        ))}
      </VStack>
    );
  }

  return (
    <Grid
      w="full"
      minW={0}
      templateColumns={{
        base: "1fr",
        md: "repeat(2, minmax(0, 1fr))",
        lg: "repeat(3, minmax(0, 1fr))",
        xl: "repeat(4, minmax(0, 1fr))",
      }}
      gap={{ base: 4, md: 6 }}
    >
      {products.map((p) => (
        <ProductCard
          key={p.id}
          title={p.title}
          url={p.url}
          status={p.status}
          imageUrl={p.imageUrl}
        />
      ))}
    </Grid>
  );
}
