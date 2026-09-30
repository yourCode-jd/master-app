"use client";

import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";

export function CardViewToggle({ targetId }: { targetId: string }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  function changeView(next: "grid" | "list") {
    setView(next);
    document.getElementById(targetId)?.setAttribute("data-view", next);
  }

  return <div className="card-view-toggle" aria-label="Card layout">
    <button type="button" className={view === "grid" ? "active" : ""} aria-pressed={view === "grid"} onClick={() => changeView("grid")}>
      <LayoutGrid size={16} aria-hidden="true"/> Grid
    </button>
    <button type="button" className={view === "list" ? "active" : ""} aria-pressed={view === "list"} onClick={() => changeView("list")}>
      <List size={16} aria-hidden="true"/> List
    </button>
  </div>;
}
