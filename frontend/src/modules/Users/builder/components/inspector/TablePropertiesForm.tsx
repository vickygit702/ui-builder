import { useState, ChangeEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  CanvasComponentInstance,
  TableColumnConfig,
  TableRowConfig,
  ColumnAlignment,
} from "../../../../types/builder.types";
import {
  TABLE_VARIANTS,
  TableVariantDef,
} from "../../../../Core/table/table.variants";
import TableColumnItem from "./TableColumnItem";

interface TablePropertiesFormProps {
  component: CanvasComponentInstance;
  sectionId: string;
  variants?: TableVariantDef[];
  onUpdate: (
    sectionId: string,
    buttonId: string,
    updates: Partial<CanvasComponentInstance>,
  ) => void;
  onRemove: (sectionId: string, buttonId: string) => void;
}

export default function TablePropertiesForm({
  component,
  sectionId,
  variants = TABLE_VARIANTS,
  onUpdate,
  onRemove,
}: TablePropertiesFormProps) {
  const [newColHeader, setNewColHeader] = useState("");

  const columns: TableColumnConfig[] = component.tableColumns || [
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
      footerText: "Active",
    },
    {
      id: "col-4",
      header: "Amount",
      headerAlign: "right",
      bodyAlign: "right",
      footerText: "$2,400.00",
    },
  ];

  const rows: TableRowConfig[] = component.tableRows || [
    {
      id: "row-1",
      cells: {
        "col-1": "Pro Plan Subscription",
        "col-2": "Software",
        "col-3": "Active",
        "col-4": "$499.00",
      },
    },
    {
      id: "row-2",
      cells: {
        "col-1": "Cloud Hosting",
        "col-2": "Infrastructure",
        "col-3": "Active",
        "col-4": "$1,400.00",
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

  const showFooter = component.tableShowFooter ?? false;
  const currentWidth = component.width || 720;

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>) {
    onUpdate(sectionId, component.id, { variant: e.target.value });
  }

  function handleWidthChange(e: ChangeEvent<HTMLInputElement>) {
    onUpdate(sectionId, component.id, { width: parseInt(e.target.value, 10) });
  }

  function handleToggleFooter() {
    onUpdate(sectionId, component.id, { tableShowFooter: !showFooter });
  }

  function handleAddColumn() {
    const trimmed = newColHeader.trim();
    if (!trimmed) return;
    const newColId = `col-${Date.now().toString(36)}`;
    const updatedCols: TableColumnConfig[] = [
      ...columns,
      {
        id: newColId,
        header: trimmed,
        headerAlign: "left",
        bodyAlign: "left",
        footerText: "—",
      },
    ];

    const updatedRows = rows.map((r) => ({
      ...r,
      cells: { ...r.cells, [newColId]: "Sample" },
    }));

    onUpdate(sectionId, component.id, {
      tableColumns: updatedCols,
      tableRows: updatedRows,
    });
    setNewColHeader("");
  }

  function handleRemoveColumn(colId: string) {
    if (columns.length <= 1) return;
    const updatedCols = columns.filter((c) => c.id !== colId);
    onUpdate(sectionId, component.id, { tableColumns: updatedCols });
  }

  function handleHeaderNameChange(colId: string, newName: string) {
    const updatedCols = columns.map((c) =>
      c.id === colId ? { ...c, header: newName } : c,
    );
    onUpdate(sectionId, component.id, { tableColumns: updatedCols });
  }

  function handleHeaderAlignChange(colId: string, align: ColumnAlignment) {
    const updatedCols = columns.map((c) =>
      c.id === colId ? { ...c, headerAlign: align } : c,
    );
    onUpdate(sectionId, component.id, { tableColumns: updatedCols });
  }

  function handleBodyAlignChange(colId: string, align: ColumnAlignment) {
    const updatedCols = columns.map((c) =>
      c.id === colId ? { ...c, bodyAlign: align } : c,
    );
    onUpdate(sectionId, component.id, { tableColumns: updatedCols });
  }

  function handleFooterTextChange(colId: string, text: string) {
    const updatedCols = columns.map((c) =>
      c.id === colId ? { ...c, footerText: text } : c,
    );
    onUpdate(sectionId, component.id, { tableColumns: updatedCols });
  }

  function handleAddRow() {
    const newRowId = `row-${Date.now().toString(36)}`;
    const newCells: Record<string, string> = {};
    columns.forEach((c) => {
      newCells[c.id] = `Data ${rows.length + 1}`;
    });
    onUpdate(sectionId, component.id, {
      tableRows: [...rows, { id: newRowId, cells: newCells }],
    });
  }

  function handleRemoveRow() {
    if (rows.length <= 1) return;
    onUpdate(sectionId, component.id, {
      tableRows: rows.slice(0, rows.length - 1),
    });
  }

  function handleRemoveComponent() {
    onRemove(sectionId, component.id);
  }

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Style Variant */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          Table Style Variant
        </label>
        <select
          value={component.variant || "standard"}
          onChange={handleVariantChange}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-indigo-500"
        >
          {variants.map((v) => (
            <option key={v.key} value={v.key}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Width slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-[11px] font-semibold text-slate-700">
            Table Width
          </label>
          <span className="text-[10px] font-mono text-slate-500">
            {currentWidth}px
          </span>
        </div>
        <input
          type="range"
          min={420}
          max={1100}
          step={20}
          value={currentWidth}
          onChange={handleWidthChange}
          className="w-full accent-indigo-600"
        />
      </div>

      {/* 3. With / Without Footer toggle */}
      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
        <div>
          <span className="font-semibold text-slate-700 block">
            Table Footer
          </span>
          <span className="text-[10px] text-slate-500">
            {showFooter ? "With footer summary row" : "Without footer"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleToggleFooter}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
            showFooter
              ? "bg-indigo-600 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          {showFooter ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* 4. Column-by-Column Manager */}
      <div className="border border-slate-200 rounded-lg p-2.5 bg-white">
        <label className="block text-[11px] font-semibold text-slate-800 mb-2 flex items-center justify-between">
          <span>Columns ({columns.length})</span>
          <span className="text-[10px] font-normal text-slate-400">
            Alignments per column
          </span>
        </label>

        {/* Enter header one by one input */}
        <div className="flex items-center gap-1.5 mb-3">
          <input
            type="text"
            placeholder="New column title..."
            value={newColHeader}
            onChange={(e) => setNewColHeader(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddColumn();
              }
            }}
            className="flex-1 text-xs px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddColumn}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {/* Column items list */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {columns.map((col) => (
            <TableColumnItem
              key={col.id}
              col={col}
              canDelete={columns.length > 1}
              showFooter={showFooter}
              onNameChange={handleHeaderNameChange}
              onHeaderAlignChange={handleHeaderAlignChange}
              onBodyAlignChange={handleBodyAlignChange}
              onFooterTextChange={handleFooterTextChange}
              onRemove={handleRemoveColumn}
            />
          ))}
        </div>
      </div>

      {/* 5. Row Manager */}
      <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
        <span className="text-slate-700 font-medium">Rows: {rows.length}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAddRow}
            className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-xs font-medium"
          >
            + Add Row
          </button>
          {rows.length > 1 && (
            <button
              type="button"
              onClick={handleRemoveRow}
              className="px-2 py-1 bg-white border border-slate-300 hover:text-red-600 rounded text-xs font-medium"
            >
              - Remove
            </button>
          )}
        </div>
      </div>

      {/* Remove Component */}
      <div className="pt-3 border-t border-slate-200">
        <button
          type="button"
          onClick={handleRemoveComponent}
          className="w-full py-2 bg-red-50 text-red-600 border border-red-200 rounded-md font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove Table
        </button>
      </div>
    </div>
  );
}
