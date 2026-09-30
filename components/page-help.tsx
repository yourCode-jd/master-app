"use client";
import { CircleHelp, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { pageHelp, terminology } from "@/lib/training";

export function PageHelp() {
  const path = usePathname(); const [open, setOpen] = useState(false); const help = pageHelp(path);
  return <><button type="button" className="button button-ghost page-help-trigger" aria-label="How this page works" onClick={() => setOpen(true)}><CircleHelp size={18}/><span>How this page works</span></button>{open && <div className="training-help-backdrop" role="presentation"><aside className="training-help" role="dialog" aria-modal="true" aria-label={`How ${help.title} works`}><button className="button button-ghost training-close" onClick={() => setOpen(false)} aria-label="Close help"><X size={18}/></button><p className="eyebrow">HOW THIS PAGE WORKS</p><h2>{help.title}</h2><dl><div><dt>Purpose</dt><dd>{help.purpose}</dd></div><div><dt>What to look at</dt><dd>{help.lookAt}</dd></div><div><dt>Main action</dt><dd>{help.action}</dd></div><div><dt>What happens next</dt><dd>{help.next}</dd></div></dl><details className="training-terms"><summary>Key terms</summary>{Object.entries(terminology).map(([term, definition]) => <p key={term}><strong>{term}</strong><br/>{definition}</p>)}</details></aside></div>}</>;
}
