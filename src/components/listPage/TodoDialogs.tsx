import type { Dispatch, SetStateAction } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Input,
  NativeSelect,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { TodoItem, TodoList, TodoUser } from "@/types/todo";

type TaskDraft = {
  title: string;
  completed: boolean;
};

type ListDraft = {
  title: string;
};

type DeleteTaskTarget = {
  listId: string;
  itemId: string;
  title: string;
};

type EditTaskTarget = {
  listId: string;
  item: TodoItem;
};

type TodoDialogsProps = {
  createListOpen: boolean;
  onCloseCreateList: () => void;
  listDraft: ListDraft;
  setListDraft: Dispatch<SetStateAction<ListDraft>>;
  onSubmitCreateList: () => Promise<void>;
  isCreatingList: boolean;
  editListTarget: TodoList | null;
  onCloseEditList: () => void;
  onSubmitEditList: () => Promise<void>;
  isUpdatingList: boolean;
  deleteListTarget: TodoList | null;
  onCloseDeleteList: () => void;
  onSubmitDeleteList: () => Promise<void>;
  isDeletingList: boolean;
  createListId: string | null;
  onCloseCreateTask: () => void;
  taskDraft: TaskDraft;
  setTaskDraft: Dispatch<SetStateAction<TaskDraft>>;
  onSubmitCreateTask: () => Promise<void>;
  isCreatingTask: boolean;
  editTaskTarget: EditTaskTarget | null;
  onCloseEditTask: () => void;
  onSubmitEditTask: () => Promise<void>;
  isUpdatingTask: boolean;
  deleteTaskTarget: DeleteTaskTarget | null;
  onCloseDeleteTask: () => void;
  onSubmitDeleteTask: () => Promise<void>;
  isDeletingTask: boolean;
  assignTargetList: TodoList | null;
  onCloseAssign: () => void;
  assigneeId: string;
  setAssigneeId: (value: string) => void;
  users: TodoUser[];
  onConfirmAssign: () => Promise<void>;
  isAssigning: boolean;
  assignError: string | null;
};

export function TodoDialogs({
  createListOpen,
  onCloseCreateList,
  listDraft,
  setListDraft,
  onSubmitCreateList,
  isCreatingList,
  editListTarget,
  onCloseEditList,
  onSubmitEditList,
  isUpdatingList,
  deleteListTarget,
  onCloseDeleteList,
  onSubmitDeleteList,
  isDeletingList,
  createListId,
  onCloseCreateTask,
  taskDraft,
  setTaskDraft,
  onSubmitCreateTask,
  isCreatingTask,
  editTaskTarget,
  onCloseEditTask,
  onSubmitEditTask,
  isUpdatingTask,
  deleteTaskTarget,
  onCloseDeleteTask,
  onSubmitDeleteTask,
  isDeletingTask,
  assignTargetList,
  onCloseAssign,
  assigneeId,
  setAssigneeId,
  users,
  onConfirmAssign,
  isAssigning,
  assignError,
}: TodoDialogsProps) {
  return (
    <>
      <Dialog.Root open={createListOpen} onOpenChange={(d) => !d.open && onCloseCreateList()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Create Todo List</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <ListForm draft={listDraft} onChange={setListDraft} />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onCloseCreateList}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button onClick={() => void onSubmitCreateList()} loading={isCreatingList}>
                  Create list
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root open={!!editListTarget} onOpenChange={(d) => !d.open && onCloseEditList()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Todo List</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <ListForm draft={listDraft} onChange={setListDraft} />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onCloseEditList}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button onClick={() => void onSubmitEditList()} loading={isUpdatingList}>
                  Save list
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root open={!!deleteListTarget} onOpenChange={(d) => !d.open && onCloseDeleteList()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete Todo List</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="text.primary">
                  Delete list{" "}
                  <Text as="span" fontWeight="700">
                    {deleteListTarget?.title}
                  </Text>
                  ? All tasks in this list will be removed.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onCloseDeleteList}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="red" onClick={() => void onSubmitDeleteList()} loading={isDeletingList}>
                  Delete list
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root open={!!createListId} onOpenChange={(d) => !d.open && onCloseCreateTask()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Create Task</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <TaskForm draft={taskDraft} onChange={setTaskDraft} showCompleted={false} />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onCloseCreateTask}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button onClick={() => void onSubmitCreateTask()} loading={isCreatingTask}>
                  Create
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root open={!!editTaskTarget} onOpenChange={(d) => !d.open && onCloseEditTask()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Task</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <TaskForm draft={taskDraft} onChange={setTaskDraft} showCompleted />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onCloseEditTask}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button onClick={() => void onSubmitEditTask()} loading={isUpdatingTask}>
                  Save changes
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root open={!!deleteTaskTarget} onOpenChange={(d) => !d.open && onCloseDeleteTask()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete Task</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="text.primary">
                  Delete <Text as="span" fontWeight="700">{deleteTaskTarget?.title}</Text>? This action cannot be undone.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onCloseDeleteTask}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="red" onClick={() => void onSubmitDeleteTask()} loading={isDeletingTask}>
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root open={!!assignTargetList} onOpenChange={(d) => !d.open && onCloseAssign()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Assign Todo List</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack align="stretch" gap={3}>
                  <Text color="text.muted" fontSize="sm">
                    Choose a user for <Text as="span" color="text.primary" fontWeight="600">{assignTargetList?.title}</Text>
                  </Text>
                  <NativeSelect.Root disabled={isAssigning}>
                    <NativeSelect.Field
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                    >
                      <option value="">Select a user</option>
                      {users.map((assignUser) => (
                        <option key={assignUser.id} value={assignUser.id}>
                          {assignUser.email}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {assignError ? (
                    <Text color="red.500" fontSize="sm">
                      {assignError}
                    </Text>
                  ) : null}
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onCloseAssign}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button onClick={() => void onConfirmAssign()} disabled={!assigneeId} loading={isAssigning}>
                  Assign
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

type TaskFormProps = {
  draft: TaskDraft;
  onChange: Dispatch<SetStateAction<TaskDraft>>;
  showCompleted: boolean;
};

type ListFormProps = {
  draft: ListDraft;
  onChange: Dispatch<SetStateAction<ListDraft>>;
};

function ListForm({ draft, onChange }: ListFormProps) {
  return (
    <VStack align="stretch" gap={4}>
      <Box>
        <Text mb={1.5} fontSize="sm" fontWeight="600" color="text.primary">
          List Title
        </Text>
        <Input
          placeholder="e.g. Sprint Backlog"
          value={draft.title}
          onChange={(e) => onChange((prev) => ({ ...prev, title: e.target.value }))}
        />
      </Box>
    </VStack>
  );
}

function TaskForm({ draft, onChange, showCompleted }: TaskFormProps) {
  return (
    <VStack align="stretch" gap={4}>
      <Box>
        <Text mb={1.5} fontSize="sm" fontWeight="600" color="text.primary">
          Title
        </Text>
        <Input
          placeholder="e.g. Prepare monthly metrics"
          value={draft.title}
          onChange={(e) => onChange((prev) => ({ ...prev, title: e.target.value }))}
        />
      </Box>

      {showCompleted ? (
        <Checkbox.Root
          checked={draft.completed}
          onCheckedChange={(e) =>
            onChange((prev) => ({ ...prev, completed: e.checked === true }))
          }
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Mark as completed</Checkbox.Label>
        </Checkbox.Root>
      ) : null}
    </VStack>
  );
}
