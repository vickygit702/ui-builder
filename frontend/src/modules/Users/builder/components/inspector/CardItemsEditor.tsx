import { CardItemConfig } from "../../../../types/builder.types";

interface CardItemsEditorProps {
  cards: CardItemConfig[];
  onTitleChange: (cardId: string, title: string) => void;
  onDescChange: (cardId: string, description: string) => void;
}

export default function CardItemsEditor({
  cards,
  onTitleChange,
  onDescChange,
}: CardItemsEditorProps) {
  return (
    <div className="border border-slate-200 rounded-lg p-2.5 bg-white space-y-2">
      <label className="block text-[11px] font-semibold text-slate-800">
        Card Content ({cards.length})
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className="p-2 bg-slate-50 border border-slate-200 rounded-md space-y-1"
          >
            <span className="text-[10px] font-bold text-slate-500 block uppercase">
              Card #{idx + 1}
            </span>
            <input
              type="text"
              value={card.title}
              onChange={(e) => onTitleChange(card.id, e.target.value)}
              placeholder="Title..."
              className="w-full text-xs font-semibold px-2 py-0.5 border border-slate-300 rounded bg-white"
            />
            <textarea
              value={card.description || ""}
              onChange={(e) => onDescChange(card.id, e.target.value)}
              placeholder="Description..."
              rows={2}
              className="w-full text-xs px-2 py-0.5 border border-slate-300 rounded bg-white resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
