import React, { CSSProperties } from "react";
import { TABLE_VARIANTS } from "./table.variants";

export type ColumnAlignment = "left" | "center" | "right";

export interface TableColumn {
  id: string;
  header: string;
  headerAlign?: ColumnAlignment;
  bodyAlign?: ColumnAlignment;
  footerText?: string;
}

export interface TableRow {
  id: string;
  cells: Record<string, string>;
}

export interface TableProps {
  columns?: TableColumn[];
  rows?: TableRow[];
  showFooter?: boolean;
  variant?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_COLUMNS: TableColumn[] = [
  {
    id: "col-1",
    header: "Item",
    headerAlign: "left",
    bodyAlign: "left",
    footerText: "Total",
  },
  {
    id: "col-2",
    header: "Category",
    headerAlign: "center",
    bodyAlign: "center",
    footerText: "—",
  },
  {
    id: "col-3",
    header: "Status",
    headerAlign: "center",
    bodyAlign: "center",
    footerText: "—",
  },
  {
    id: "col-4",
    header: "Amount",
    headerAlign: "right",
    bodyAlign: "right",
    footerText: "$2,850.00",
  },
];

const DEFAULT_ROWS: TableRow[] = [
  {
    id: "row-1",
    cells: {
      "col-1": "Pro Subscription",
      "col-2": "Software",
      "col-3": "Active",
      "col-4": "$499.00",
    },
  },
  {
    id: "row-2",
    cells: {
      "col-1": "Enterprise Cloud Setup",
      "col-2": "Infrastructure",
      "col-3": "Pending",
      "col-4": "$1,850.00",
    },
  },
  {
    id: "row-3",
    cells: {
      "col-1": "Dedicated Support SLA",
      "col-2": "Services",
      "col-3": "Active",
      "col-4": "$501.00",
    },
  },
];

function getAlignClass(align?: ColumnAlignment): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export default function Table({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  showFooter = false,
  variant = "standard",
  className = "",
  style,
}: TableProps) {
  const variantDef =
    TABLE_VARIANTS.find((v) => v.key === variant) ?? TABLE_VARIANTS[0];

  const cols = columns.length > 0 ? columns : DEFAULT_COLUMNS;
  const isCompact = variant === "compact";

  return (
    <div
      style={style}
      className={`w-full overflow-x-auto rounded-lg border border-slate-200 shadow-xs bg-white ${className}`}
    >
      <table className={variantDef.classNames}>
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {cols.map((col) => {
              const alignCls = getAlignClass(col.headerAlign);
              return (
                <th
                  key={col.id}
                  scope="col"
                  className={`${isCompact ? "px-3 py-2 text-xs" : "px-4 py-3 text-xs"} font-semibold text-slate-700 uppercase tracking-wider ${alignCls}`}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={cols.length}
                className="px-4 py-8 text-center text-slate-400 text-xs italic"
              >
                No table data available
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                {cols.map((col) => {
                  const alignCls = getAlignClass(col.bodyAlign);
                  return (
                    <td
                      key={col.id}
                      className={`${isCompact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} text-slate-700 whitespace-nowrap ${alignCls}`}
                    >
                      {row.cells[col.id] ?? "—"}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>

        {showFooter && (
          <tfoot className="bg-slate-50/90 border-t-2 border-slate-200 font-semibold text-slate-800">
            <tr>
              {cols.map((col) => {
                const alignCls = getAlignClass(
                  col.bodyAlign || col.headerAlign,
                );
                return (
                  <td
                    key={col.id}
                    className={`${isCompact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-xs md:text-sm"} ${alignCls}`}
                  >
                    {col.footerText || ""}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
