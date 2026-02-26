export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoList {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  assigneeId: string;
  assigneeName?: string;
  createdAt: string;
  updatedAt: string;
  items: TodoItem[];
}

export interface TodoListSummary {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  assigneeId: string;
  assigneeName?: string;
  createdAt: string;
  updatedAt: string;
  totalCount: number;
  completedCount: number;
}

export interface TodoUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface TodoCreatePayload {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface TodoUpdatePayload {
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
}

export interface TodoListCreatePayload {
  title: string;
  description?: string;
  assigneeId?: string;
}

export interface TodoListUpdatePayload {
  title: string;
  description?: string;
}
