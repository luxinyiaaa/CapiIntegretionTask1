import * as React from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Skeleton,
  SkeletonCircle,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { AxiosError } from "axios";
import {
  FiPlus,
} from "react-icons/fi";

import { AppLayout } from "@/components/layout/AppLayout";
import { ListCard } from "@/components/listPage/ListCard";
import { TodoDialogs } from "@/components/listPage/TodoDialogs";
import { useAuthStore } from "@/store/authStore";
import {
  useAssignableUsers,
  useTodoLists,
} from "@/hooks/useTodoQueries";
import { useTaskMutations, useTasks } from "@/hooks/useTaskQueries";
import { useTodoListMutations } from "@/hooks/useTodoListMutations";
import type {
  TodoCreatePayload,
  TodoItem,
  TodoListCreatePayload,
  TodoListUpdatePayload,
  TodoList,
  TodoUpdatePayload,
} from "@/types/todo";

type TaskDraft = {
  title: string;
  completed: boolean;
};

type ListDraft = {
  title: string;
};

const createDefaultDraft = (): TaskDraft => ({
  title: "",
  completed: false,
});

const createDefaultListDraft = (): ListDraft => ({
  title: "",
});

const LISTS_PAGE_SIZE = 6;

export default function TodolistPage() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const isAdmin = user?.role === "admin";

  const { data: lists = [], isLoading, isError, error, refetch } = useTodoLists({
    userId: user?.id,
    role: user?.role,
    enabled: status === "authenticated" && !!user,
  });
  const { data: tasks = [] } = useTasks({
    userId: user?.id,
    role: user?.role,
    enabled: status === "authenticated" && !!user,
  });

  const { data: users = [] } = useAssignableUsers(Boolean(isAdmin));

  const {
    createList,
    updateList,
    removeList,
    assignList,
  } = useTodoListMutations(user?.id);
  const { createTask, updateTask, removeTask } = useTaskMutations(user?.id);

  const [createListOpen, setCreateListOpen] = React.useState(false);
  const [editListTarget, setEditListTarget] = React.useState<TodoList | null>(null);
  const [deleteListTarget, setDeleteListTarget] = React.useState<TodoList | null>(null);

  const [createListId, setCreateListId] = React.useState<string | null>(null);
  const [editTarget, setEditTarget] = React.useState<{
    listId: string;
    item: TodoItem;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    listId: string;
    itemId: string;
    title: string;
  } | null>(null);
  const [assignTargetList, setAssignTargetList] = React.useState<TodoList | null>(null);
  const [assignError, setAssignError] = React.useState<string | null>(null);

  const [draft, setDraft] = React.useState<TaskDraft>(createDefaultDraft());
  const [listDraft, setListDraft] = React.useState<ListDraft>(createDefaultListDraft());
  const [assigneeId, setAssigneeId] = React.useState("");
  const [visibleListCount, setVisibleListCount] = React.useState(LISTS_PAGE_SIZE);
  const loadMoreAnchorRef = React.useRef<HTMLDivElement | null>(null);

  const resetTaskDraft = React.useCallback(() => {
    setDraft(createDefaultDraft());
  }, []);

  const resetListDraft = React.useCallback(() => {
    setListDraft(createDefaultListDraft());
  }, []);

  const openCreateDialog = React.useCallback((listId: string) => {
    setCreateListId(listId);
    setDraft(createDefaultDraft());
  }, []);

  const openEditDialog = React.useCallback((listId: string, item: TodoItem) => {
    setEditTarget({ listId, item });
    setDraft({
      title: item.title,
      completed: item.completed,
    });
  }, []);

  const canManageList = React.useCallback(() => Boolean(user), [user]);

  const openEditListDialog = React.useCallback((list: TodoList) => {
    setEditListTarget(list);
    setListDraft({
      title: list.title,
    });
  }, []);

  const onCloseCreate = () => {
    setCreateListId(null);
    resetTaskDraft();
  };

  const onCloseEdit = () => {
    setEditTarget(null);
    resetTaskDraft();
  };

  const onCloseCreateList = () => {
    setCreateListOpen(false);
    resetListDraft();
  };

  const onCloseEditList = () => {
    setEditListTarget(null);
    resetListDraft();
  };

  React.useEffect(() => {
    setVisibleListCount(LISTS_PAGE_SIZE);
  }, [lists.length]);

  const visibleLists = React.useMemo(
    () => lists.slice(0, visibleListCount),
    [lists, visibleListCount],
  );

  const hasMoreLists = visibleListCount < lists.length;
  const statusCode = (error as AxiosError | null)?.response?.status;

  React.useEffect(() => {
    if (!hasMoreLists) return;
    const anchor = loadMoreAnchorRef.current;
    if (!anchor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting) return;
        setVisibleListCount((prev) => Math.min(prev + LISTS_PAGE_SIZE, lists.length));
      },
      {
        root: null,
        rootMargin: "160px 0px",
        threshold: 0,
      },
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [hasMoreLists, lists.length]);

  const submitCreateList = async () => {
    if (!user || !listDraft.title.trim()) return;
    const payload: TodoListCreatePayload = {
      title: listDraft.title.trim(),
    };
    await createList.mutateAsync({ userId: user.id, payload });
    onCloseCreateList();
  };

  const submitEditList = async () => {
    if (!editListTarget || !listDraft.title.trim()) return;
    const payload: TodoListUpdatePayload = {
      title: listDraft.title.trim(),
    };
    await updateList.mutateAsync({ listId: editListTarget.id, payload });
    onCloseEditList();
  };

  const submitDeleteList = async () => {
    if (!deleteListTarget) return;
    await removeList.mutateAsync({ listId: deleteListTarget.id });
    setDeleteListTarget(null);
  };

  const submitCreate = async () => {
    if (!createListId || !draft.title.trim()) return;

    const payload: TodoCreatePayload = {
      title: draft.title.trim(),
    };

    await createTask.mutateAsync({ listId: createListId, payload });
    onCloseCreate();
  };

  const submitEdit = async () => {
    if (!editTarget || !draft.title.trim()) return;

    const payload: TodoUpdatePayload = {
      title: draft.title.trim(),
      completed: draft.completed,
    };

    await updateTask.mutateAsync({
      listId: editTarget.listId,
      itemId: editTarget.item.id,
      payload,
    });

    onCloseEdit();
  };

  const toggleItem = async (listId: string, item: TodoItem, completed: boolean) => {
    await updateTask.mutateAsync({
      listId,
      itemId: item.id,
      payload: {
        title: item.title,
        description: item.description,
        dueDate: item.dueDate,
        completed,
      },
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await removeTask.mutateAsync({
      listId: deleteTarget.listId,
      itemId: deleteTarget.itemId,
    });
    setDeleteTarget(null);
  };

  const openAssignDialog = (list: TodoList) => {
    setAssignTargetList(list);
    setAssigneeId(list.assigneeId);
    setAssignError(null);
  };

  const confirmAssign = async () => {
    if (!assignTargetList || !assigneeId) return;
    try {
      await assignList.mutateAsync({ listId: assignTargetList.id, assigneeId });
      setAssignError(null);
      setAssignTargetList(null);
    } catch (error) {
      const status = (error as AxiosError | null)?.response?.status;
      if (status === 403) {
        setAssignError("You do not have permission to assign this todo list.");
        return;
      }
      setAssignError("Failed to assign this todo list. Please try again.");
    }
  };

  return (
    <AppLayout title="Todo Dashboard">
      <Box bg="bg.dashboard" minH="dvh" w="full">
        <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
          <VStack align="stretch" gap={6} maxW="1280px" mx="auto">
            <Flex
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              gap={3}
              direction={{ base: "column", md: "row" }}
            >
              <Box>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" color="text.primary">
                  My Todo Lists
                </Text>
                <Text color="text.muted" mt={1}>
                  Track tasks, update progress, and collaborate across teams.
                </Text>
                <Text color="text.muted" mt={1} fontSize="sm">
                  Total tasks: {tasks.length}
                </Text>
              </Box>
              <HStack>
                <Button onClick={() => setCreateListOpen(true)}>
                  <Icon as={FiPlus} />
                  New List
                </Button>
                <Button variant="outline" onClick={() => void refetch()}>
                  Refresh
                </Button>
              </HStack>
            </Flex>

            {isLoading ? <TodoListSkeletonGrid /> : null}

            {isError ? (
              <Box borderWidth="1px" borderColor="border.default" bg="bg.canvas" borderRadius="16px" p={6}>
                <Text color="red.500" fontWeight="600">
                  {statusCode === 401
                    ? "Session expired. Please log in again."
                    : statusCode === 403
                      ? "You do not have permission to access these todo lists."
                      : "Failed to load todo data."}
                </Text>
                <Button mt={4} onClick={() => void refetch()}>
                  Retry
                </Button>
              </Box>
            ) : null}

            {!isLoading && !isError && lists.length === 0 ? (
              <Box borderWidth="1px" borderColor="border.default" bg="bg.canvas" borderRadius="16px" p={8}>
                <Text fontWeight="600" color="text.primary">
                  No todo lists assigned yet.
                </Text>
                <Text color="text.muted" mt={1}>
                  Create your first todo list to get started.
                </Text>
              </Box>
            ) : null}

            <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
              {visibleLists.map((list) => {
                const canManageThisList = canManageList();
                const ownerEmail = users.find((u) => u.id === list.ownerId)?.email;
                const ownerLabel =
                  list.ownerId === user?.id ? "You" : ownerEmail ?? list.ownerId;

                return (
                  <ListCard
                    key={list.id}
                    list={list}
                    ownerLabel={ownerLabel}
                    canManage={canManageThisList}
                    isAdmin={isAdmin}
                    onEditList={openEditListDialog}
                    onDeleteList={setDeleteListTarget}
                    onAssign={openAssignDialog}
                    onCreateTask={openCreateDialog}
                    onToggleTask={toggleItem}
                    onEditTask={openEditDialog}
                    onDeleteTask={(listId, item) =>
                      setDeleteTarget({
                        listId,
                        itemId: item.id,
                        title: item.title,
                      })}
                  />
                );
              })}
            </SimpleGrid>
            {!isLoading && !isError && hasMoreLists ? (
              <Flex ref={loadMoreAnchorRef} justify="center" py={4}>
                <Text color="text.muted" fontSize="sm">
                  Loading more lists...
                </Text>
              </Flex>
            ) : null}
          </VStack>
        </Box>
      </Box>

      <TodoDialogs
        createListOpen={createListOpen}
        onCloseCreateList={onCloseCreateList}
        listDraft={listDraft}
        setListDraft={setListDraft}
        onSubmitCreateList={submitCreateList}
        isCreatingList={createList.isPending}
        editListTarget={editListTarget}
        onCloseEditList={onCloseEditList}
        onSubmitEditList={submitEditList}
        isUpdatingList={updateList.isPending}
        deleteListTarget={deleteListTarget}
        onCloseDeleteList={() => setDeleteListTarget(null)}
        onSubmitDeleteList={submitDeleteList}
        isDeletingList={removeList.isPending}
        createListId={createListId}
        onCloseCreateTask={onCloseCreate}
        taskDraft={draft}
        setTaskDraft={setDraft}
        onSubmitCreateTask={submitCreate}
        isCreatingTask={createTask.isPending}
        editTaskTarget={editTarget}
        onCloseEditTask={onCloseEdit}
        onSubmitEditTask={submitEdit}
        isUpdatingTask={updateTask.isPending}
        deleteTaskTarget={deleteTarget}
        onCloseDeleteTask={() => setDeleteTarget(null)}
        onSubmitDeleteTask={confirmDelete}
        isDeletingTask={removeTask.isPending}
        assignTargetList={assignTargetList}
        onCloseAssign={() => {
          setAssignTargetList(null);
          setAssignError(null);
        }}
        assigneeId={assigneeId}
        setAssigneeId={setAssigneeId}
        users={users}
        onConfirmAssign={confirmAssign}
        isAssigning={assignList.isPending}
        assignError={assignError}
      />
    </AppLayout>
  );
}

function TodoListSkeletonGrid() {
  return (
    <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box
          key={`todo-list-skeleton-${index}`}
          borderWidth="1px"
          borderColor="border.default"
          bg="bg.canvas"
          borderRadius="18px"
          p={{ base: 4, md: 5 }}
        >
          <Flex justify="space-between" align="flex-start" gap={3}>
            <Box flex={1}>
              <Skeleton height="22px" maxW="60%" />
              <Skeleton height="16px" mt={2} maxW="85%" />
              <HStack mt={3} gap={2}>
                <Skeleton height="20px" width="110px" borderRadius="999px" />
                <Skeleton height="20px" width="120px" borderRadius="999px" />
              </HStack>
            </Box>
            <HStack gap={2}>
              <SkeletonCircle size="8" />
              <SkeletonCircle size="8" />
              <Skeleton height="32px" width="72px" borderRadius="10px" />
            </HStack>
          </Flex>

          <Stack mt={5} gap={2.5}>
            {Array.from({ length: 3 }).map((_, taskIndex) => (
              <Flex
                key={`todo-task-skeleton-${index}-${taskIndex}`}
                borderWidth="1px"
                borderColor="border.default"
                borderRadius="12px"
                p={3}
                align="flex-start"
                justify="space-between"
                gap={3}
              >
                <HStack align="flex-start" gap={3} flex={1}>
                  <SkeletonCircle size="5" mt={1} />
                  <Box flex={1}>
                    <Skeleton height="16px" maxW="70%" />
                    <Skeleton height="14px" mt={1.5} maxW="85%" />
                    <HStack mt={2} gap={2}>
                      <Skeleton height="18px" width="70px" borderRadius="999px" />
                      <Skeleton height="18px" width="86px" borderRadius="999px" />
                    </HStack>
                  </Box>
                </HStack>
                <HStack>
                  <SkeletonCircle size="7" />
                  <SkeletonCircle size="7" />
                </HStack>
              </Flex>
            ))}
          </Stack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
