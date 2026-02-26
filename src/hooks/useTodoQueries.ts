//manage tododata request and cache
import { useQuery } from "@tanstack/react-query";

import { getAssignableUsers, getTodoListsByUser } from "@/api/todoApi";
import type {
  TodoListCreatePayload,
  TodoListUpdatePayload,
  TodoList,
  TodoUser,
} from "@/types/todo";

export const todoQueryKeys = {
  lists: (userId: string) => ["todo", "lists", userId] as const,

  users: () => ["todo", "users"] as const,
  tasks: (userId: string) => ["todo", "tasks", userId] as const,
};

type UseTodoListsOptions = {
  userId?: string;
  role?: string;
  enabled: boolean;
};

const normalizeTodoList = (list: TodoList): TodoList => ({
  ...list,
  items: Array.isArray(list.items) ? list.items : [],
});

export function useTodoLists({ userId, role, enabled }: UseTodoListsOptions) {
  return useQuery<TodoList[]>({
    queryKey: todoQueryKeys.lists(userId ?? "anonymous"),
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return getTodoListsByUser({ userId, role }).then((lists) =>
        lists.map(normalizeTodoList),
      );
    },
    enabled: enabled && !!userId,
    staleTime: 30_000,
  });
}

export function useAssignableUsers(enabled: boolean) {
  return useQuery<TodoUser[]>({
    queryKey: todoQueryKeys.users(),
    queryFn: getAssignableUsers,
    enabled,
    staleTime: 60_000,
  });
}

type CreateListInput = {
  userId: string;
  payload: TodoListCreatePayload;
};

type UpdateListInput = {
  listId: string;
  payload: TodoListUpdatePayload;
};

type DeleteListInput = {
  listId: string;
};

export type { CreateListInput, UpdateListInput, DeleteListInput };
