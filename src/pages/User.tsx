import * as React from "react";
import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

import { DataTable } from "@/components/table/DataTable";
import { PersonCell, Pill } from "@/components/table/TableCells";
import { AppLayout } from "@/components/layout/AppLayout";

// ✅ 直接用你已经写好的数据
import { people } from "@/data/ people"; // 你的 people.ts 放在哪就改成对应路径

export default function UsersPage() {
  const columns = ["User", "Project Name", "Project Revenue", "Status"];

  // ✅ rows 由 people 生成（不用再手写重复数据）
  const rows: React.ReactNode[][] = people.map((p) => [
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

      <DataTable title="Users" columns={columns} rows={rows} />
    </AppLayout>
  );
}
