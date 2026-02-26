import { Badge, Box, Checkbox, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { TodoItem } from "@/types/todo";

type TaskItemProps = {
  listId: string;
  item: TodoItem;
  canManage: boolean;
  onToggle: (listId: string, item: TodoItem, completed: boolean) => Promise<void>;
  onEdit: (listId: string, item: TodoItem) => void;
  onDelete: (listId: string, item: TodoItem) => void;
};

export function TaskItem({
  listId,
  item,
  canManage,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <Flex
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="12px"
      p={3}
      align="flex-start"
      justify="space-between"
      gap={3}
      direction={{ base: "column", sm: "row" }}
    >
      <HStack align="flex-start" gap={3} flex={1} minW={0}>
        <Checkbox.Root
          checked={item.completed}
          disabled={!canManage}
          onCheckedChange={(e) => void onToggle(listId, item, e.checked === true)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control mt={1} />
        </Checkbox.Root>
        <Box minW={0}>
          <Text
            fontWeight="600"
            color="text.primary"
            textDecoration={item.completed ? "line-through" : "none"}
            lineClamp="1"
          >
            {item.title}
          </Text>
          {item.description ? (
            <Text color="text.muted" fontSize="sm" mt={0.5} lineClamp="2">
              {item.description}
            </Text>
          ) : null}
          <HStack gap={2} mt={2}>
            {item.dueDate ? (
              <Badge colorPalette="purple" variant="subtle">
                Due {item.dueDate}
              </Badge>
            ) : null}
          </HStack>
        </Box>
      </HStack>

      <HStack>
        <IconButton
          aria-label="Edit task"
          size="sm"
          variant="ghost"
          disabled={!canManage}
          onClick={() => onEdit(listId, item)}
        >
          <FiEdit2 />
        </IconButton>
        <IconButton
          aria-label="Delete task"
          size="sm"
          variant="ghost"
          colorPalette="red"
          disabled={!canManage}
          onClick={() => onDelete(listId, item)}
        >
          <FiTrash2 />
        </IconButton>
      </HStack>
    </Flex>
  );
}
