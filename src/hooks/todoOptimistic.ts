import type { QueryClient } from "@tanstack/react-query";
import type { TodoItem, TodoList } from "@/types/todo";

export type TaskRecord = {
  listId: string;
  item: TodoItem;
};

export type TodoCacheSnapshot = {
  previousLists?: TodoList[];
  previousTasks?: TaskRecord[];
};

type UpdateCachesInput = {
  queryClient: QueryClient;
  listQueryKey: readonly unknown[];
  taskQueryKey: readonly unknown[];
  updater: (currentLists: TodoList[]) => TodoList[];
};

type SnapshotInput = {
  queryClient: QueryClient;
  listQueryKey: readonly unknown[];
  taskQueryKey: readonly unknown[];
};

export function buildTaskRecords(lists: TodoList[]): TaskRecord[] {
  return lists.flatMap((list) =>
    (list.items ?? []).map((item) => ({
      listId: list.id,
      item,
    })),
  );
}

export async function startTodoOptimisticUpdate({
  queryClient,
  listQueryKey,
  taskQueryKey,
}: SnapshotInput): Promise<TodoCacheSnapshot> {
  await Promise.all([
    queryClient.cancelQueries({ queryKey: listQueryKey }),
    queryClient.cancelQueries({ queryKey: taskQueryKey }),
  ]);

  return {
    previousLists: queryClient.getQueryData<TodoList[]>(listQueryKey),
    previousTasks: queryClient.getQueryData<TaskRecord[]>(taskQueryKey),
  };
}

export function rollbackTodoOptimisticUpdate({
  queryClient,
  listQueryKey,
  taskQueryKey,
  snapshot,
}: SnapshotInput & { snapshot?: TodoCacheSnapshot }): void {
  if (!snapshot) return;
  queryClient.setQueryData(listQueryKey, snapshot.previousLists);
  queryClient.setQueryData(taskQueryKey, snapshot.previousTasks);
}

export function updateTodoCaches({
  queryClient,
  listQueryKey,
  taskQueryKey,
  updater,
}: UpdateCachesInput): void {
  const currentLists = queryClient.getQueryData<TodoList[]>(listQueryKey) ?? [];
  const nextLists = updater(currentLists);
  queryClient.setQueryData<TodoList[]>(listQueryKey, nextLists);
  queryClient.setQueryData<TaskRecord[]>(taskQueryKey, buildTaskRecords(nextLists));
}
