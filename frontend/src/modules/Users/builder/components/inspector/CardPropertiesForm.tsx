import { ChangeEvent } from "react";
import { Trash2, BoxSelect } from "lucide-react";
import {
  CanvasComponentInstance,
  CardItemConfig,
} from "../../../../types/builder.types";
import {
  CARD_VARIANTS,
  CardVariantDef,
} from "../../../../Core/card/card.variants";
import CardItemsEditor from "./CardItemsEditor";

interface CardPropertiesFormProps {
  component: CanvasComponentInstance;
  sectionId: string;
  variants?: CardVariantDef[];
  onUpdate: (
    sectionId: string,
    buttonId: string,
    updates: Partial<CanvasComponentInstance>,
  ) => void;
  onRemove: (sectionId: string, buttonId: string) => void;
}

const DEFAULT_CARDS: CardItemConfig[] = [
  {
    id: "card-1",
    title: "Analytics",
    subtitle: "Real-time Metrics",
    description: "Monitor visitor engagement and conversion metrics.",
    badge: "New",
  },
  {
    id: "card-2",
    title: "Cloud Hosting",
    subtitle: "Edge Scalability",
    description:
      "Deploy apps on low-latency edge servers with instant auto-scaling.",
    badge: "Cloud",
  },
  {
    id: "card-3",
    title: "Enterprise Security",
    subtitle: "Compliance",
    description: "End-to-end data encryption and role-based access control.",
    badge: "Secure",
  },
  {
    id: "card-4",
    title: "Automations",
    subtitle: "Productivity",
    description: "Build custom event-driven workflows and automate tasks.",
    badge: "Fast",
  },
];

export default function CardPropertiesForm({
  component,
  sectionId,
  variants = CARD_VARIANTS,
  onUpdate,
  onRemove,
}: CardPropertiesFormProps) {
  const isBaseCard = Boolean(component.isBaseCard) || component.cardCount === 0;
  const cardCount = isBaseCard ? 0 : (component.cardCount ?? 3);
  const currentWidth = component.width ?? (isBaseCard ? 880 : 820);
  const currentGap = component.cardGap || "gap-6";
  const currentCorner = component.cardCorner || "xl";
  const currentHeight =
    component.cardHeight ?? (isBaseCard ? (component.height ?? 420) : 240);
  const cardItems: CardItemConfig[] =
    component.cardItems && component.cardItems.length > 0
      ? component.cardItems
      : DEFAULT_CARDS;

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>) {
    onUpdate(sectionId, component.id, { variant: e.target.value });
  }

  function handleCountChange(count: number) {
    if (count === 0) {
      onUpdate(sectionId, component.id, {
        cardCount: 0,
        isBaseCard: true,
        width: component.width || 880,
        height: component.cardHeight || 420,
        cardHeight: component.cardHeight || 420,
        label: component.label || "Container Panel",
      });
    } else {
      onUpdate(sectionId, component.id, {
        cardCount: count,
        isBaseCard: false,
        width:
          component.width && component.width > 1200
            ? 820
            : component.width || 820,
        height:
          component.cardHeight && component.cardHeight > 380
            ? 240
            : component.cardHeight || 240,
        cardHeight:
          component.cardHeight && component.cardHeight > 380
            ? 240
            : component.cardHeight || 240,
      });
    }
  }

  function handleLabelChange(e: ChangeEvent<HTMLInputElement>) {
    onUpdate(sectionId, component.id, { label: e.target.value });
  }

  function handleWidthChange(e: ChangeEvent<HTMLInputElement>) {
    onUpdate(sectionId, component.id, { width: parseInt(e.target.value, 10) });
  }

  function handleGapChange(gap: string) {
    onUpdate(sectionId, component.id, { cardGap: gap });
  }

  function handleCornerChange(corner: string) {
    onUpdate(sectionId, component.id, { cardCorner: corner });
  }

  function handleHeightChange(e: ChangeEvent<HTMLInputElement>) {
    const nextH = parseInt(e.target.value, 10);
    onUpdate(sectionId, component.id, {
      cardHeight: nextH,
      height: nextH,
    });
  }

  function handleCardTitleChange(cardId: string, title: string) {
    const updated = cardItems.map((c) =>
      c.id === cardId ? { ...c, title } : c,
    );
    onUpdate(sectionId, component.id, { cardItems: updated });
  }

  function handleCardDescChange(cardId: string, description: string) {
    const updated = cardItems.map((c) =>
      c.id === cardId ? { ...c, description } : c,
    );
    onUpdate(sectionId, component.id, { cardItems: updated });
  }

  function handleRemoveComponent() {
    onRemove(sectionId, component.id);
  }

  const activeCards = cardItems.slice(0, Math.max(1, cardCount));

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Theme Variant */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          {isBaseCard
            ? "Base Card Theme (shadow-md)"
            : "Card Theme (shadow-md)"}
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

      {/* 2. Mode / Count Selector */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          Card Mode / Count
        </label>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => handleCountChange(0)}
            className={`flex-1 py-1.5 rounded-md font-semibold text-xs border transition-colors ${
              isBaseCard
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Base Card
          </button>
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleCountChange(num)}
              className={`flex-1 py-1.5 rounded-md font-semibold text-xs border transition-colors ${
                !isBaseCard && cardCount === num
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Base Container Label */}
      {isBaseCard && (
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Container Header Label
          </label>
          <input
            type="text"
            value={component.label || ""}
            onChange={handleLabelChange}
            placeholder="e.g. Dashboard Overview"
            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* 3. Flexible Width */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-[11px] font-semibold text-slate-700">
            {isBaseCard ? "Base Card Width" : "Grid Width"}
          </label>
          <span className="text-[10px] font-mono text-slate-500">
            {currentWidth}px
          </span>
        </div>
        <input
          type="range"
          min={300}
          max={isBaseCard ? 1400 : 1200}
          step={20}
          value={currentWidth}
          onChange={handleWidthChange}
          className="w-full accent-indigo-600"
        />
      </div>

      {/* 4. Configurable Height */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-[11px] font-semibold text-slate-700">
            {isBaseCard ? "Base Card Height" : "Card Height"}
          </label>
          <span className="text-[10px] font-mono text-slate-500">
            {currentHeight}px
          </span>
        </div>
        <input
          type="range"
          min={isBaseCard ? 150 : 180}
          max={isBaseCard ? 1000 : 380}
          step={10}
          value={currentHeight}
          onChange={handleHeightChange}
          className="w-full accent-indigo-600"
        />
      </div>

      {/* 5. Rounded Corners Configurable */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          Corners
        </label>
        <div className="grid grid-cols-5 gap-1 text-[10px]">
          {[
            { key: "none", label: "None" },
            { key: "md", label: "MD" },
            { key: "lg", label: "LG" },
            { key: "xl", label: "XL" },
            { key: "2xl", label: "2XL" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleCornerChange(item.key)}
              className={`py-1 rounded border text-center font-medium ${
                currentCorner === item.key
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Base Card Informational Helper or Grid Options */}
      {isBaseCard ? (
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg flex items-start gap-2 text-indigo-900">
          <BoxSelect className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <span className="font-semibold block mb-0.5">
              Base Surface Layer
            </span>
            Tables, cards, or buttons placed on the canvas can be positioned
            freely over this base card.
          </div>
        </div>
      ) : (
        <>
          {/* Between Gaps Configurable */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Between Cards Gap
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { key: "gap-2", label: "8px" },
                { key: "gap-4", label: "16px" },
                { key: "gap-6", label: "24px" },
                { key: "gap-8", label: "32px" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleGapChange(item.key)}
                  className={`py-1 text-center font-medium rounded border ${
                    currentGap === item.key
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card Content Customization */}
          <CardItemsEditor
            cards={activeCards}
            onTitleChange={handleCardTitleChange}
            onDescChange={handleCardDescChange}
          />
        </>
      )}

      {/* Remove Component */}
      <div className="pt-3 border-t border-slate-200">
        <button
          type="button"
          onClick={handleRemoveComponent}
          className="w-full py-2 bg-red-50 text-red-600 border border-red-200 rounded-md font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {isBaseCard ? "Remove Base Card" : "Remove Cards"}
        </button>
      </div>
    </div>
  );
}
