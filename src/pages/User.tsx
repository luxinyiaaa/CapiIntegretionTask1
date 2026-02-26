import * as React from "react";
import {
  Button,
  Dialog,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  NativeSelect,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { DataTable } from "@/components/table/DataTable";
import { PersonCell, Pill } from "@/components/table/TableCells";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";

// ✅ 直接用你已经写好的数据
import { people, type Person } from "@/data/ people"; // 你的 people.ts 放在哪就改成对应路径

type UserDraft = {
  name: string;
  email: string;
  projectName: string;
  revenue: string;
  dealStatus: "negotiation" | "won" | "lost";
};

const toDraft = (person: Person): UserDraft => ({
  name: person.name,
  email: person.email,
  projectName: person.projectName ?? "",
  revenue: String(person.revenue ?? ""),
  dealStatus: person.dealStatus ?? "negotiation",
});

export default function UsersPage() {
  const authUser = useAuthStore((state) => state.user);
  const isAdmin = authUser?.role === "admin";

  const [userRows, setUserRows] = React.useState<Person[]>(people);
  const [editingUser, setEditingUser] = React.useState<Person | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<Person | null>(null);
  const [draft, setDraft] = React.useState<UserDraft | null>(null);

  const columns = ["User", "Project Name", "Project Revenue", "Status"];

  const rows: React.ReactNode[][] = userRows.map((p) => [
    <PersonCell name={p.name} email={p.email} avatarSrc={p.avatar} />,
    <span style={{ fontWeight: 600 }}>{p.projectName ?? "—"}</span>,
    <span style={{ fontWeight: 600 }}>€ {p.revenue ?? "—"}</span>,
    p.dealStatus === "negotiation" ? (
      <Pill colorPalette="purple">In Negotiation</Pill>
    ) : p.dealStatus === "won" ? (
      <Pill colorPalette="green">Closed - Won</Pill>
    ) : p.dealStatus === "lost" ? (
      <Pill colorPalette="red">Closed - Lost</Pill>
    ) : (
      <Pill colorPalette="gray">—</Pill>
    ),
  ]);

  const rowActions = isAdmin
    ? userRows.map((p) => (
        <HStack justify="flex-end" gap={1.5}>
          <IconButton
            aria-label={`Edit ${p.name}`}
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingUser(p);
              setDraft(toDraft(p));
            }}
          >
            <FiEdit2 />
          </IconButton>
          <IconButton
            aria-label={`Delete ${p.name}`}
            size="sm"
            variant="ghost"
            colorPalette="red"
            onClick={() => setDeletingUser(p)}
          >
            <FiTrash2 />
          </IconButton>
        </HStack>
      ))
    : undefined;

  const saveEdit = () => {
    if (!editingUser || !draft) return;
    setUserRows((prev) =>
      prev.map((person) =>
        person.id === editingUser.id
          ? {
              ...person,
              name: draft.name.trim() || person.name,
              email: draft.email.trim() || person.email,
              projectName: draft.projectName.trim(),
              revenue: Number(draft.revenue) || 0,
              dealStatus: draft.dealStatus,
            }
          : person,
      ),
    );
    setEditingUser(null);
    setDraft(null);
  };

  const deleteUser = () => {
    if (!deletingUser) return;
    setUserRows((prev) => prev.filter((person) => person.id !== deletingUser.id));
    setDeletingUser(null);
  };

  return (
    <AppLayout title="Users">
      <Flex align="center" justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="semibold">
          Users
        </Text>
        <Button
          variant="solid"
          bg="button.primary"
          color="text.primary"
          gap="2"
        >
          <Icon as={FiPlus} />
          Add New User
        </Button>
      </Flex>

      <DataTable
        title="Users"
        columns={columns}
        rows={rows}
        rowActions={rowActions}
        actionHeader={isAdmin ? "Actions" : ""}
        showDefaultRowAction={false}
      />

      <Dialog.Root
        open={!!editingUser}
        onOpenChange={(details) => {
          if (!details.open) {
            setEditingUser(null);
            setDraft(null);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit User</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {draft ? (
                  <VStack align="stretch" gap={3}>
                    <Input
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                      }
                      placeholder="Name"
                    />
                    <Input
                      value={draft.email}
                      onChange={(e) =>
                        setDraft((prev) => (prev ? { ...prev, email: e.target.value } : prev))
                      }
                      placeholder="Email"
                    />
                    <Input
                      value={draft.projectName}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev ? { ...prev, projectName: e.target.value } : prev,
                        )
                      }
                      placeholder="Project Name"
                    />
                    <Input
                      type="number"
                      value={draft.revenue}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev ? { ...prev, revenue: e.target.value } : prev,
                        )
                      }
                      placeholder="Revenue"
                    />
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={draft.dealStatus}
                        onChange={(e) =>
                          setDraft((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  dealStatus: e.target
                                    .value as UserDraft["dealStatus"],
                                }
                              : prev,
                          )
                        }
                      >
                        <option value="negotiation">In Negotiation</option>
                        <option value="won">Closed - Won</option>
                        <option value="lost">Closed - Lost</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </VStack>
                ) : null}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={saveEdit}>Save</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={!!deletingUser}
        onOpenChange={(details) => {
          if (!details.open) {
            setDeletingUser(null);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete User</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Delete <Text as="span" fontWeight="700">{deletingUser?.name}</Text>?
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="red" onClick={deleteUser}>
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </AppLayout>
  );
}
