import { Input, Text, VStack } from "@chakra-ui/react";
import type { ChangeEventHandler } from "react";

interface AuthFieldProps {
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: string;
}

export function AuthField({
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}: AuthFieldProps) {
  return (
    <VStack align="stretch" gap={1}>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        borderRadius="input"
        bg="bg.canvas"
        _placeholder={{ color: "text.muted" }}
      />
      {error ? (
        <Text fontSize="xs" color="red.500">
          {error}
        </Text>
      ) : null}
    </VStack>
  );
}
