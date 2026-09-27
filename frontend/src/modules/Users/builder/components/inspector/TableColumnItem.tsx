import { ChangeEvent } from "react";
import { Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import {
  TableColumnConfig,
  ColumnAlignment,
} from "../../../../types/builder.types";

interface TableColumnItemProps {
  col: TableColumnConfig;
  canDelete: boolean;
  showFooter: boolean;
  onNameChange: (colId: string, name: string) => void;
  onHeaderAlignChange: (colId: string, align: ColumnAlignment) => void;
  onBodyAlignChange: (colId: string, align: ColumnAlignment) => void;
  onFooterTextChange: (colId: string, text: string) => void;
  onRemove: (colId: string) => void;
}

export default function TableColumnItem({
  col,
  canDelete,
  showFooter,
  onNameChange,
  onHeaderAlignChange,
  onBodyAlignChange,
  onFooterTextChange,
  onRemove,
}: TableColumnItemProps) {
  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    onNameChange(col.id, e.target.value);
  }

  function handleFooterChange(e: ChangeEvent<HTMLInputElement>) {
    onFooterTextChange(col.id, e.target.value);
  }

  function handleRemove() {
    onRemove(col.id);
  }

  return (
    <div className="p-2 bg-slate-50 border border-slate-200 rounded-md space-y-1.5">
      <div className="flex items-center gap-1.5 justify-between">
        <input
          type="text"
          value={col.header}
          onChange={handleNameChange}
          className="w-full text-xs font-semibold px-1.5 py-0.5 border border-slate-300 rounded bg-white"
        />
        {canDelete && (
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-slate-400 hover:text-red-600 rounded"
            title="Delete column"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Alignments */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        {/* Header text alignment */}
        <div>
          <span className="text-slate-500 block mb-0.5">Header Align</span>
          <div className="flex border border-slate-200 rounded bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => onHeaderAlignChange(col.id, "left")}
              className={`flex-1 py-1 flex justify-center ${col.headerAlign === "left" || !col.headerAlign ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-400 hover:bg-slate-50"}`}
              title="Header Left"
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onHeaderAlignChange(col.id, "center")}
              className={`flex-1 py-1 flex justify-center ${col.headerAlign === "center" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-400 hover:bg-slate-50"}`}
              title="Header Center"
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onHeaderAlignChange(col.id, "right")}
              className={`flex-1 py-1 flex justify-center ${col.headerAlign === "right" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-400 hover:bg-slate-50"}`}
              title="Header Right"
            >
              <AlignRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Body text alignment */}
        <div>
          <span className="text-slate-500 block mb-0.5">Body Align</span>
          <div className="flex border border-slate-200 rounded bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => onBodyAlignChange(col.id, "left")}
              className={`flex-1 py-1 flex justify-center ${col.bodyAlign === "left" || !col.bodyAlign ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-400 hover:bg-slate-50"}`}
              title="Body Left"
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onBodyAlignChange(col.id, "center")}
              className={`flex-1 py-1 flex justify-center ${col.bodyAlign === "center" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-400 hover:bg-slate-50"}`}
              title="Body Center"
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onBodyAlignChange(col.id, "right")}
              className={`flex-1 py-1 flex justify-center ${col.bodyAlign === "right" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-400 hover:bg-slate-50"}`}
              title="Body Right"
            >
              <AlignRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer text if enabled */}
      {showFooter && (
        <div className="pt-1">
          <span className="text-[10px] text-slate-500 block mb-0.5">
            Footer Text
          </span>
          <input
            type="text"
            value={col.footerText || ""}
            onChange={handleFooterChange}
            placeholder="Footer cell text..."
            className="w-full text-xs px-1.5 py-0.5 border border-slate-200 rounded bg-white"
          />
        </div>
      )}
    </div>
  );
}
