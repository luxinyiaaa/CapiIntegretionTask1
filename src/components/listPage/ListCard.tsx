import { Badge, Box, Button, Flex, HStack, Icon, IconButton, Stack, Text } from "@chakra-ui/react";
import { FiCheckCircle, FiEdit2, FiPlus, FiTrash2, FiUserPlus } from "react-icons/fi";
import type { TodoItem, TodoList } from "@/types/todo";
import { TaskItem } from "@/components/listPage/TaskItem";

type ListCardProps = {
  list: TodoList;
  ownerLabel: string;
  canManage: boolean;
  isAdmin: boolean;
  onEditList: (list: TodoList) => void;
  onDeleteList: (list: TodoList) => void;
  onAssign: (list: TodoList) => void;
  onCreateTask: (listId: string) => void;
  onToggleTask: (listId: string, item: TodoItem, completed: boolean) => Promise<void>;
  onEditTask: (listId: string, item: TodoItem) => void;
  onDeleteTask: (listId: string, item: TodoItem) => void;
};

export function ListCard({
  list,
  ownerLabel,
  canManage,
  isAdmin,
  onEditList,
  onDeleteList,
  onAssign,
  onCreateTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: ListCardProps) {
  const completedCount = list.items.filter((item) => item.completed).length;
  const isOptimisticList = list.id.startsWith("optimistic-list-");

  return (
    <Box
      borderWidth="1px"
      borderColor="border.default"
      bg="bg.canvas"
      borderRadius="18px"
      p={{ base: 4, md: 5 }}
      boxShadow="0 8px 24px rgba(15, 23, 42, 0.06)"
    >
      <Flex justify="space-between" gap={3} align="flex-start">
        <Box minW={0}>
          <Text fontWeight="700" fontSize="lg" color="text.primary" lineClamp="1">
            {list.title}
          </Text>
          {list.description ? (
            <Text color="text.muted" mt={1} lineClamp="2">
              {list.description}
            </Text>
          ) : null}
          <HStack mt={3} gap={2} flexWrap="wrap">
            <Badge colorPalette="blue" variant="subtle">
              {completedCount}/{list.items.length} completed
            </Badge>
            <Badge colorPalette="teal" variant="subtle">
              Owner: {ownerLabel}
            </Badge>
            <Badge colorPalette="gray" variant="subtle">
              Assigned: {list.assigneeId ? "Yes" : "None"}
            </Badge>
          </HStack>
        </Box>

        <HStack gap={2}>
          {canManage ? (
            <>
              <IconButton
                aria-label="Edit list"
                size="sm"
                variant="outline"
                onClick={() => onEditList(list)}
              >
                <FiEdit2 />
              </IconButton>
              <IconButton
                aria-label="Delete list"
                size="sm"
                variant="outline"
                colorPalette="red"
                onClick={() => onDeleteList(list)}
              >
                <FiTrash2 />
              </IconButton>
            </>
          ) : null}
          {isAdmin ? (
            <Button size="sm" variant="outline" onClick={() => onAssign(list)}>
              <Icon as={FiUserPlus} />
              Assign
            </Button>
          ) : null}
          <Button
            size="sm"
            disabled={!canManage || isOptimisticList}
            onClick={() => onCreateTask(list.id)}
          >
            <Icon as={FiPlus} />
            Task
          </Button>
        </HStack>
      </Flex>

      <Stack mt={5} gap={2.5}>
        {list.items.map((item) => (
          <TaskItem
            key={item.id}
            listId={list.id}
            item={item}
            canManage={canManage}
            onToggle={onToggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {list.items.length === 0 ? (
          <Flex
            borderWidth="1px"
            borderStyle="dashed"
            borderColor="border.default"
            borderRadius="12px"
            p={4}
            color="text.muted"
            justify="center"
            align="center"
            gap={2}
          >
            <Icon as={FiCheckCircle} />
            <Text fontSize="sm">No tasks yet. Create your first task.</Text>
          </Flex>
        ) : null}
      </Stack>
    </Box>
  );
}
