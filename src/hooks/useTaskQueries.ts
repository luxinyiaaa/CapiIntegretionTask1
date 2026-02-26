import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createTodoItem,
  deleteTodoItem,
  updateTodoItem,
} from "@/api/todoApi";
import { todoQueryKeys, useTodoLists } from "@/hooks/useTodoQueries";
import {
  rollbackTodoOptimisticUpdate,
  startTodoOptimisticUpdate,
  type TodoCacheSnapshot,
  updateTodoCaches,
} from "@/hooks/todoOptimistic";
import type {
  TodoCreatePayload,
  TodoItem,
  TodoUpdatePayload,
} from "@/types/todo";

type UseTasksOptions = {
  userId?: string;
  role?: string;
  enabled: boolean;
};

type CreateTaskInput = {
  listId: string;
  payload: TodoCreatePayload;
};

type UpdateTaskInput = {
  listId: string;
  itemId: string;
  payload: TodoUpdatePayload;
};

type DeleteTaskInput = {
  listId: string;
  itemId: string;
};

export function useTasks({ userId, role, enabled }: UseTasksOptions) {
  const query = useTodoLists({ userId, role, enabled });

  const taskRecords = useMemo(
    () =>
      (query.data ?? []).flatMap((list) =>
        (list.items ?? []).map((item) => ({
          listId: list.id,
          item,
        })),
      ),
    [query.data],
  );

  return {
    ...query,
    data: taskRecords,
  };
}

export function useTaskMutations(userId?: string) {
  const queryClient = useQueryClient();

  const listQueryKey = useMemo(
    () => todoQueryKeys.lists(userId ?? "anonymous"),
    [userId],
  );

  const taskQueryKey = useMemo(
    () => todoQueryKeys.tasks(userId ?? "anonymous"),
    [userId],
  );

  type TaskMutationContext = TodoCacheSnapshot;

  const invalidateTaskAndListQueries = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: listQueryKey }),
      queryClient.invalidateQueries({ queryKey: taskQueryKey }),
    ]);

  const createTask = useMutation<TodoItem, Error, CreateTaskInput, TaskMutationContext>({
    mutationFn: ({ listId, payload }) => createTodoItem({ listId, payload }),
    onMutate: async ({ listId, payload }) => {
      const snapshot = await startTodoOptimisticUpdate({
        queryClient,
        listQueryKey,
        taskQueryKey,
      });
      const now = new Date().toISOString();
      const optimisticItem: TodoItem = {
        id: `optimistic-task-${Date.now()}`,
        title: payload.title.trim(),
        description: payload.description?.trim(),
        completed: false,
        dueDate: payload.dueDate,
        createdAt: now,
        updatedAt: now,
      };

      updateTodoCaches({
        queryClient,
        listQueryKey,
        taskQueryKey,
        updater: (currentLists) =>
          currentLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  updatedAt: now,
                  items: [optimisticItem, ...(list.items ?? [])],
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
      void invalidateTaskAndListQueries();
    },
  });

  const updateTask = useMutation<TodoItem, Error, UpdateTaskInput, TaskMutationContext>({
    mutationFn: ({ listId, itemId, payload }) => updateTodoItem({ listId, itemId, payload }),
    onMutate: async ({ listId, itemId, payload }) => {
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
                  updatedAt: now,
                  items: (list.items ?? []).map((item) =>
                    item.id === itemId
                      ? {
                          ...item,
                          title: payload.title.trim(),
                          description: payload.description?.trim(),
                          dueDate: payload.dueDate,
                          completed: payload.completed,
                          updatedAt: now,
                        }
                      : item,
                  ),
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
      void invalidateTaskAndListQueries();
    },
  });

  const removeTask = useMutation<void, Error, DeleteTaskInput, TaskMutationContext>({
    mutationFn: ({ listId, itemId }) => deleteTodoItem({ listId, itemId }),
    onMutate: async ({ listId, itemId }) => {
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
                  updatedAt: now,
                  items: (list.items ?? []).filter((item) => item.id !== itemId),
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
      void invalidateTaskAndListQueries();
    },
  });

  return {
    createTask,
    updateTask,
    removeTask,
  };
}
