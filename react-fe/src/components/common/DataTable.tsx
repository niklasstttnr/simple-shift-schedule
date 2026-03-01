import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DataTableProps<T extends RowData> = {
  /** Column definitions (TanStack Table ColumnDef). */
  columns: ColumnDef<T>[];
  /** Table data. */
  data: T[];
  /** Unique key per row; defaults to row index. */
  getRowId?: (row: T) => string;
  /** Optional: header area above the table (e.g. title + "Add" button). */
  header?: React.ReactNode;
  /** Optional: area between header and table (e.g. filters). Extensible for future filters. */
  toolbar?: React.ReactNode;
  /** Message when data is empty. */
  emptyMessage?: string;
  /** Loading state: show a loading message instead of the table. */
  loading?: boolean;
  /** Error state: if set, render error UI instead of the table. */
  error?: Error | null;
  /** Callback when a row is clicked. Omit for no row click (e.g. use actions in columns). */
  onRowClick?: (row: T) => void;
  /** Optional class for the table wrapper (e.g. rounded-md border). */
  className?: string;
};

export function DataTable<T extends RowData>({
  columns,
  data,
  getRowId,
  header,
  toolbar,
  emptyMessage = "No data.",
  loading = false,
  error = null,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(getRowId && {
      getRowId: (originalRow: T) => getRowId(originalRow as T),
    }),
  });

  if (error) {
    return (
      <div className="text-destructive rounded-md border border-destructive/50 bg-destructive/10 p-4">
        <p className="font-medium">Failed to load data</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {header != null && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {header}
        </div>
      )}
      {toolbar != null && <div>{toolbar}</div>}
      {loading ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          Loading…
        </div>
      ) : (
        <div className={className ?? "rounded-md border"}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-muted-foreground h-24 text-center"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={
                      onRowClick
                        ? () => onRowClick(row.original as T)
                        : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
