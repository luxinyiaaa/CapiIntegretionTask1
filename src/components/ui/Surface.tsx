import { Box, type BoxProps } from "@chakra-ui/react";

export function Surface(props: BoxProps) {
  const { children, ...rest } = props;
  return (
    <Box
      bg="bg.canvas"
      borderWidth="1px"
      borderColor="bg.surface"
      borderRadius="16px"
      boxShadow="sm"
      p={{ base: 4, md: 5 }} // ✅ 自适应 padding
      {...rest}
    >
      {children}
    </Box>
  );
}
