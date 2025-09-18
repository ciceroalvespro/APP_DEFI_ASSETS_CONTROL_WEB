import { ReactNode } from "react";

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T extends { id: string | number }> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyLabel?: string;
};

export function DataTable<T extends { id: string | number }>({ columns, data, onRowClick, emptyLabel }: DataTableProps<T>) {
  return (
    <div className="overflow-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/5">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className={`text-left p-2 ${col.className ?? ""}`.trim()}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-white/60">
                {emptyLabel ?? "Nenhum registro"}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row.id)}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-white/5 ${onRowClick ? "cursor-pointer" : ""}`.trim()}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className={`p-2 ${col.className ?? ""}`.trim()}>
                    {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
