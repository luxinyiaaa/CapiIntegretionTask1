import { apiClient } from "@/api/axios";
import type {
  TodoCreatePayload,
  TodoItem,
  TodoListCreatePayload,
  TodoListUpdatePayload,
  TodoList,
  TodoUpdatePayload,
  TodoUser,
} from "@/types/todo";

type RawTodoList = {
  id: string;
  title: string;
  owner: string;
  assigned_to?: string | null;
  created_at: string;
};

type RawTodoItem = {
  id: string;
  todo_list: string;
  title: string;
  completed: boolean;
  created_at: string;
};

type RawTodoUser = {
  id: string;
  email: string;
  name?: string | null;
  role: string;
};

type RawPaginated<T> = {
  results: T[];
};

let cachedApiUsers: TodoUser[] = [];

const withAssigneeName = (
  list: TodoList,
  sourceUsers?: TodoUser[],
): TodoList => {
  if (!list.assigneeId) {
    return { ...list, assigneeName: undefined };
  }
  const users = sourceUsers ?? cachedApiUsers;
  const user = users.find((u) => u.id === list.assigneeId);
  return { ...list, assigneeName: user?.email ?? "Unknown" };
};

const mapRawTodoItem = (raw: RawTodoItem): TodoItem => ({
  id: raw.id,
  title: raw.title,
  completed: raw.completed,
  createdAt: raw.created_at,
  updatedAt: raw.created_at,
});

const mapRawTodoUser = (raw: RawTodoUser): TodoUser => ({
  id: raw.id,
  email: raw.email,
  name: raw.name?.trim() || raw.email.split("@")[0] || "Unknown",
  role: raw.role,
});

const mapRawTodoList = (raw: RawTodoList, items: TodoItem[]): TodoList => ({
  id: raw.id,
  title: raw.title,
  description: undefined,
  ownerId: raw.owner,
  assigneeId: raw.assigned_to ?? "",
  assigneeName: undefined,
  createdAt: raw.created_at,
  updatedAt: raw.created_at,
  items,
});

const filterByUser = (lists: TodoList[], userId: string, role?: string) => {
  if (role === "admin") return lists;
  return lists.filter(
    (list) => list.assigneeId === userId || list.ownerId === userId,
  );
};

type ListParams = {
  userId: string;
  role?: string;
};

export async function getTodoListsByUser(
  params: ListParams,
): Promise<TodoList[]> {
  const usersPromise =
    params.role === "admin"
      ? apiClient
          .get<RawTodoUser[] | RawPaginated<RawTodoUser>>("/users/")
          .then((response) => {
            const rows = Array.isArray(response.data)
              ? response.data
              : (response.data.results ?? []);
            return rows.map(mapRawTodoUser);
          })
          .catch(() => [] as TodoUser[])
      : Promise.resolve([] as TodoUser[]);

  const [listResponse, assignedListResponse, itemResponse, userResponse] =
    await Promise.all([
      apiClient.get<RawTodoList[]>("/todolists/", {
        params: { user_id: params.userId },
      }),
      apiClient
        .get<RawTodoList[]>(`/users/${params.userId}/assigned-todos/`)
        .then((response) => response.data)
        .catch(() => [] as RawTodoList[]),
      apiClient.get<RawTodoItem[]>("/todoitems/"),
      usersPromise,
    ]);

  if (userResponse.length > 0) {
    cachedApiUsers = userResponse;
  }

  const itemsByListId = new Map<string, TodoItem[]>();
  for (const rawItem of itemResponse.data) {
    const mappedItem = mapRawTodoItem(rawItem);
    const listItems = itemsByListId.get(rawItem.todo_list) ?? [];
    listItems.push(mappedItem);
    itemsByListId.set(rawItem.todo_list, listItems);
  }

  const mergedRawLists = new Map<string, RawTodoList>();
  for (const rawList of listResponse.data) {
    mergedRawLists.set(rawList.id, rawList);
  }
  for (const rawAssignedList of assignedListResponse) {
    mergedRawLists.set(rawAssignedList.id, rawAssignedList);
  }

  const lists = Array.from(mergedRawLists.values()).map((rawList) =>
    mapRawTodoList(rawList, itemsByListId.get(rawList.id) ?? []),
  );
  const usersForMapping = userResponse.length > 0 ? userResponse : undefined;
  return filterByUser(
    lists.map((list) => withAssigneeName(list, usersForMapping)),
    params.userId,
    params.role,
  );
}

type CreateListParams = {
  userId: string;
  payload: TodoListCreatePayload;
};

export async function createTodoList({
  payload,
}: CreateListParams): Promise<TodoList> {
  const response = await apiClient.post<RawTodoList>("/todolists/", {
    title: payload.title.trim(),
    assigned_to: payload.assigneeId ?? null,
  });
  return withAssigneeName(mapRawTodoList(response.data, []));
}

type UpdateListParams = {
  listId: string;
  payload: TodoListUpdatePayload;
};

export async function updateTodoList({
  listId,
  payload,
}: UpdateListParams): Promise<TodoList> {
  const response = await apiClient.put<RawTodoList>(`/todolists/${listId}/`, {
    title: payload.title.trim(),
  });
  return withAssigneeName(mapRawTodoList(response.data, []));
}

type DeleteListParams = {
  listId: string;
};

export async function deleteTodoList({
  listId,
}: DeleteListParams): Promise<void> {
  await apiClient.delete(`/todolists/${listId}/`);
}

export async function getAssignableUsers(): Promise<TodoUser[]> {
  const response = await apiClient.get<
    RawTodoUser[] | RawPaginated<RawTodoUser>
  >("/users/");
  const rows = Array.isArray(response.data)
    ? response.data
    : (response.data.results ?? []);
  const users = rows.map(mapRawTodoUser);
  cachedApiUsers = users;
  return users;
}

type CreateTodoParams = {
  listId: string;
  payload: TodoCreatePayload;
};

export async function createTodoItem({
  listId,
  payload,
}: CreateTodoParams): Promise<TodoItem> {
  const response = await apiClient.post<RawTodoItem>("/todoitems/", {
    todo_list: listId,
    title: payload.title.trim(),
    completed: false,
  });
  return mapRawTodoItem(response.data);
}

type UpdateTodoParams = {
  listId: string;
  itemId: string;
  payload: TodoUpdatePayload;
};

export async function updateTodoItem({
  listId,
  itemId,
  payload,
}: UpdateTodoParams): Promise<TodoItem> {
  const response = await apiClient.put<RawTodoItem>(`/todoitems/${itemId}/`, {
    todo_list: listId,
    title: payload.title.trim(),
    completed: payload.completed,
  });
  return mapRawTodoItem(response.data);
}

type DeleteTodoParams = {
  listId: string;
  itemId: string;
};

export async function deleteTodoItem({
  itemId,
}: DeleteTodoParams): Promise<void> {
  await apiClient.delete(`/todoitems/${itemId}/`);
}

type AssignParams = {
  listId: string;
  assigneeId: string;
};

export async function assignTodoList({
  listId,
  assigneeId,
}: AssignParams): Promise<TodoList> {
  await apiClient.post(`/todolists/${listId}/assign/`, {
    user_id: assigneeId,
  });
  const currentListResponse = await apiClient.get<RawTodoList>(
    `/todolists/${listId}/`,
  );
  return withAssigneeName(mapRawTodoList(currentListResponse.data, []));
}
