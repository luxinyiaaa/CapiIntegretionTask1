import * as React from "react";
import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

import { DataTable } from "@/components/table/DataTable";
import { PersonCell, Pill } from "@/components/table/TableCells";
import { AppLayout } from "@/components/layout/AppLayout";

import { people } from "@/data/ people"; // 同一份数据

export default function AdminsPage() {
  const columns = [
    "Admin",
    "Total Earnings",
    "Total Projects",
    "Status",
    "Type",
  ];

  const rows: React.ReactNode[][] = people.map((p) => [
    <PersonCell name={p.name} email={p.email} avatarSrc={p.avatar} />,
    <span style={{ fontWeight: 600 }}>€{p.totalEarnings ?? "—"}</span>,
    <span style={{ fontWeight: 600 }}>{p.totalProjects ?? "—"}</span>,
    p.status === "active" ? (
      <Pill colorPalette="green">Active</Pill>
    ) : p.status === "disabled" ? (
      <Pill colorPalette="red">Disabled</Pill>
    ) : (
      <Pill colorPalette="gray">—</Pill>
    ),
    p.type === "remote" ? (
      <Pill colorPalette="purple">Remote</Pill>
    ) : p.type === "in-person" ? (
      <Pill colorPalette="green">In Person</Pill>
    ) : (
      <Pill colorPalette="gray">—</Pill>
    ),
  ]);

  return (
    <AppLayout title="Admins">
      <Flex align="center" justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="semibold">
          Admins
        </Text>
        <Button
          variant="solid"
          bg="button.primary"
          color="text.primary"
          gap="2"
        >
          <Icon as={FiPlus} />
          Add New Admin
        </Button>
      </Flex>

      <DataTable title="Admins" columns={columns} rows={rows} />
    </AppLayout>
  );
}
