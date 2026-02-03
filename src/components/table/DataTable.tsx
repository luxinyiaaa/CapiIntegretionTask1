import * as React from "react";
import { Box, Input, InputGroup, IconButton, Table } from "@chakra-ui/react";
import { FiSearch, FiMoreVertical } from "react-icons/fi";

export interface DataTableProps {
  title: string;
  columns: string[];
  rows: React.ReactNode[][];
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
}

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <Box>
      <Box
        bg="bg.canvas"
        borderRadius="card"
        boxShadow="sm"
        p={{ base: 4, md: 6 }}
      >
        {/* search */}
        <InputGroup
          maxW={{ base: "100%", md: "420px" }}
          mb={4}
          startElement={<FiSearch />}
        >
          <Input placeholder="Search by name or email" />
        </InputGroup>

        {/* table */}
        <Box overflowX="auto">
          <Table.Root
            size="md"
            variant="outline"
            borderWidth="1px"
            borderColor="border.default"
            borderRadius="input"
            overflow="hidden"
          >
            <Table.Header bg="bg.dashboard">
              <Table.Row>
                {columns.map((c) => (
                  <Table.ColumnHeader
                    key={c}
                    fontSize="sm"
                    fontWeight="medium"
                    color="text.muted"
                    py={4}
                    borderRight="1px solid"
                    borderColor="border.default"
                  >
                    {c}
                  </Table.ColumnHeader>
                ))}

                <Table.ColumnHeader w="56px" />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {rows.map((row, i) => (
                <Table.Row key={i}>
                  {row.map((cell, j) => (
                    <Table.Cell
                      key={j}
                      py={4}
                      borderRight="1px solid"
                      borderColor="border.default"
                    >
                      {cell}
                    </Table.Cell>
                  ))}

                  <Table.Cell py={4} textAlign="right" w="56px">
                    <IconButton
                      aria-label="Row actions"
                      variant="ghost"
                      size="sm"
                    >
                      <FiMoreVertical />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </Box>
  );
}
