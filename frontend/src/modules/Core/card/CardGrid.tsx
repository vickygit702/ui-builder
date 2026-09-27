import React, { CSSProperties } from "react";
import Card, { CardProps } from "./Card";

export interface CardGridItemData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  actionLabel?: string;
}

export interface CardGridProps {
  count?: number;
  cards?: CardGridItemData[];
  gap?: string;
  corner?: string;
  height?: number | string;
  variant?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_CARDS: CardGridItemData[] = [
  {
    id: "card-1",
    title: "Analytics Engine",
    subtitle: "Real-time Metrics",
    description:
      "Monitor traffic, visitor engagement, and conversion metrics in real-time dashboards with visual charts.",
    badge: "New",
    actionLabel: "View Details",
  },
  {
    id: "card-2",
    title: "Cloud Infrastructure",
    subtitle: "High Availability",
    description:
      "Deploy apps on ultra-low latency edge servers with instant auto-scaling and continuous backup protections.",
    badge: "Popular",
    actionLabel: "Explore",
  },
  {
    id: "card-3",
    title: "Security & Compliance",
    subtitle: "Enterprise Grade",
    description:
      "End-to-end data encryption, SOC2 certified hosting, role-based access control, and automated compliance auditing.",
    badge: "Secure",
    actionLabel: "Learn More",
  },
  {
    id: "card-4",
    title: "Workflow Automation",
    subtitle: "Productivity",
    description:
      "Build custom event-driven workflows and automate repetitive administrative tasks with simple triggers.",
    badge: "Fast",
    actionLabel: "Configure",
  },
];

const GAP_MAP: Record<string, string> = {
  "gap-2": "gap-2",
  "gap-4": "gap-4",
  "gap-6": "gap-6",
  "gap-8": "gap-8",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export default function CardGrid({
  count = 3,
  cards = DEFAULT_CARDS,
  gap = "gap-6",
  corner = "xl",
  height = 240,
  variant = "standard",
  className = "",
  style,
}: CardGridProps) {
  const actualCount = Math.max(1, Math.min(count, 6));
  const displayedCards = (cards.length > 0 ? cards : DEFAULT_CARDS).slice(
    0,
    actualCount,
  );

  // Fill in placeholders if user requested count exceeds cards array
  while (displayedCards.length < actualCount) {
    const idx = displayedCards.length + 1;
    displayedCards.push({
      id: `card-${idx}`,
      title: `Card Feature ${idx}`,
      subtitle: "Custom Card",
      description:
        "Easily customize title, subtitle, description, and action buttons in the properties inspector.",
      badge: `Card ${idx}`,
      actionLabel: "Action",
    });
  }

  const gapClass = GAP_MAP[gap] || "gap-6";

  const gridColsClass =
    actualCount === 1
      ? "grid-cols-1"
      : actualCount === 2
        ? "grid-cols-1 md:grid-cols-2"
        : actualCount === 3
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <div
      style={style}
      className={`w-full grid ${gridColsClass} ${gapClass} ${className}`}
    >
      {displayedCards.map((card) => (
        <Card
          key={card.id}
          title={card.title}
          subtitle={card.subtitle}
          description={card.description}
          badge={card.badge}
          actionLabel={card.actionLabel}
          variant={variant}
          corner={corner}
          height={height}
        />
      ))}
    </div>
  );
}
