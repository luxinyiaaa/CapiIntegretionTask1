import { Input, InputGroup, IconButton, Text, VStack } from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { ChangeEventHandler } from "react";

export function PasswordField({
  value,
  onChange,
  error,
}: {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <VStack align="stretch" gap={1}>
      <InputGroup
        endElement={
          <IconButton
            aria-label="toggle password"
            size="sm"
            variant="ghost"
            onClick={() => setShow(!show)}
          >
            {show ? <Eye size={16} /> : <EyeOff size={16} />}
          </IconButton>
        }
      >
        <Input
          type={show ? "text" : "password"}
          placeholder="Password"
          value={value}
          onChange={onChange}
          borderRadius="input"
          bg="bg.canvas"
          _placeholder={{ color: "text.muted" }}
        />
      </InputGroup>

      {error ? (
        <Text fontSize="xs" color="red.500">
          {error}
        </Text>
      ) : null}
    </VStack>
  );
}
