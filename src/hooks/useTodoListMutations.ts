import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  assignTodoList,
  createTodoList,
  deleteTodoList,
  updateTodoList,
} from "@/api/todoApi";
import {
  todoQueryKeys,
  type CreateListInput,
  type DeleteListInput,
  type UpdateListInput,
} from "@/hooks/useTodoQueries";
import {
  rollbackTodoOptimisticUpdate,
  startTodoOptimisticUpdate,
  type TodoCacheSnapshot,
  updateTodoCaches,
} from "@/hooks/todoOptimistic";
import type { TodoList, TodoUser } from "@/types/todo";

type AssignListInput = {
  listId: string;
  assigneeId: string;
};

export function useTodoListMutations(userId?: string) {
  const queryClient = useQueryClient();

  const listQueryKey = useMemo(
    () => todoQueryKeys.lists(userId ?? "anonymous"),
    [userId],
  );

  const invalidateTodoData = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: listQueryKey }),
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.tasks(userId ?? "anonymous") }),
    ]);

  const taskQueryKey = useMemo(
    () => todoQueryKeys.tasks(userId ?? "anonymous"),
    [userId],
  );

  type ListMutationContext = TodoCacheSnapshot;
  type CreateListMutationContext = TodoCacheSnapshot & {
    optimisticListId: string;
  };

  const createList = useMutation<TodoList, Error, CreateListInput, CreateListMutationContext>({
    mutationFn: ({ userId: ownerId, payload }) => createTodoList({ userId: ownerId, payload }),
    onMutate: async ({ userId: ownerId, payload }) => {
      const snapshot = await startTodoOptimisticUpdate({
        queryClient,
        listQueryKey,
        taskQueryKey,
      });
      const now = new Date().toISOString();
      const assigneeId = payload.assigneeId ?? "";
      const users = queryClient.getQueryData<TodoUser[]>(todoQueryKeys.users()) ?? [];
      const assignee = users.find((user) => user.id === assigneeId);
      const optimisticListId = `optimistic-list-${Date.now()}`;
      const optimisticList: TodoList = {
        id: optimisticListId,
        title: payload.title.trim(),
        description: payload.description?.trim(),
        ownerId,
        assigneeId,
        assigneeName: assignee?.email,
        createdAt: now,
        updatedAt: now,
        items: [],
      };

      updateTodoCaches({
        queryClient,
        listQueryKey,
        taskQueryKey,
        updater: (currentLists) => [optimisticList, ...currentLists],
      });

      return {
        ...snapshot,
        optimisticListId,
      };
    },
    onSuccess: (createdList, _variables, context) => {
      if (!context?.optimisticListId) return;
      updateTodoCaches({
        queryClient,
        listQueryKey,
        taskQueryKey,
        updater: (currentLists) =>
          currentLists.map((list) =>
            list.id === context.optimisticListId
              ? {
                  ...createdList,
                  items: Array.isArray(createdList.items) ? createdList.items : [],
                }
              : list,
          ),
      });
    },
    onError: (_error, _variables, context) => {
      rollbackTodoOptimisticUpdate({
        queryClient,
        listQueryKey,
        taskQueryKey,
        snapshot: context,
      });
    },
    onSettled: () => {
      void invalidateTodoData();
    },
  });

  const updateList = useMutation<TodoList, Error, UpdateListInput, ListMutationContext>({
    mutationFn: ({ listId, payload }) => updateTodoList({ listId, payload }),
    onMutate: async ({ listId, payload }) => {
      const snapshot = await startTodoOptimisticUpdate({
        queryClient,
        listQueryKey,
        taskQueryKey,
      });
      const now = new Date().toISOString();

      updateTodoCaches({
        queryClient,
        listQueryKey,
        taskQueryKey,
        updater: (currentLists) =>
          currentLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  title: payload.title.trim(),
                  description: payload.description?.trim(),
                  updatedAt: now,
                }
              : list,
          ),
      });

      return snapshot;
    },
    onError: (_error, _variables, context) => {
      rollbackTodoOptimisticUpdate({
        queryClient,
        listQueryKey,
        taskQueryKey,
        snapshot: context,
      });
    },
    onSettled: () => {
      void invalidateTodoData();
    },
  });

  const removeList = useMutation<void, Error, DeleteListInput, ListMutationContext>({
    mutationFn: ({ listId }) => deleteTodoList({ listId }),
    onMutate: async ({ listId }) => {
      const snapshot = await startTodoOptimisticUpdate({
        queryClient,
        listQueryKey,
        taskQueryKey,
      });

      updateTodoCaches({
        queryClient,
        listQueryKey,
        taskQueryKey,
        updater: (currentLists) => currentLists.filter((list) => list.id !== listId),
      });

      return snapshot;
    },
    onError: (_error, _variables, context) => {
      rollbackTodoOptimisticUpdate({
        queryClient,
        listQueryKey,
        taskQueryKey,
        snapshot: context,
      });
    },
    onSettled: () => {
      void invalidateTodoData();
    },
  });

  const assignList = useMutation<TodoList, Error, AssignListInput, ListMutationContext>({
    mutationFn: ({ listId, assigneeId }) => assignTodoList({ listId, assigneeId }),
    onMutate: async ({ listId, assigneeId }) => {
      const snapshot = await startTodoOptimisticUpdate({
        queryClient,
        listQueryKey,
        taskQueryKey,
      });
      const now = new Date().toISOString();
      const users = queryClient.getQueryData<TodoUser[]>(todoQueryKeys.users()) ?? [];
      const assignee = users.find((user) => user.id === assigneeId);

      updateTodoCaches({
        queryClient,
        listQueryKey,
        taskQueryKey,
        updater: (currentLists) =>
          currentLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  assigneeId,
                  assigneeName: assignee?.email ?? list.assigneeName,
                  updatedAt: now,
                }
              : list,
          ),
      });

      return snapshot;
    },
    onError: (_error, _variables, context) => {
      rollbackTodoOptimisticUpdate({
        queryClient,
        listQueryKey,
        taskQueryKey,
        snapshot: context,
      });
    },
    onSettled: () => {
      void invalidateTodoData();
      void queryClient.invalidateQueries({ queryKey: todoQueryKeys.users() });
    },
  });

  return {
    createList,
    updateList,
    removeList,
    assignList,
  };
}
