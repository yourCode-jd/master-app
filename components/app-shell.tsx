"use client";
import { useState } from "react";
import { BarChart3, BellRing, ClipboardCheck, Menu, Settings, Users, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/permissions";

const links = [
  { href: "/", label: "Decision dashboard", icon: BarChart3 },
  { href: "/attention", label: "Attention", icon: BellRing },
  { href: "/trainer", label: "Trainer actions", icon: ClipboardCheck },
  { href: "/members", label: "Members", icon: Users },
  { href: "/settings", label: "Demo settings", icon: Settings },
];
function Links({ close }: { close?: () => void }) { const path = usePathname(); return <nav className="nav" aria-label="Primary navigation">{links.map(({ href, label, icon: Icon }) => <a key={href} href={href} onClick={close} className={`nav-link ${path === href ? "active" : ""}`}><Icon size={18}/>{label}</a>)}</nav>; }
export function AppShell({ children, user }: { children: React.ReactNode; user: { name: string; role: Role } }) {
  const [open, setOpen] = useState(false); const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  return <div className="shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">G</span>Gym Intelligence</div><Links/><div className="sidebar-footer">DEMO MODE · All services use local simulators</div></aside>{open && <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation"><button className="drawer-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)}/><aside className="drawer-panel"><button className="button button-ghost drawer-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X/></button><div className="brand"><span className="brand-mark">G</span>Gym Intelligence</div><Links close={() => setOpen(false)}/></aside></div>}<div className="main"><header className="topbar"><button className="button button-secondary mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={18}/></button><div className="topbar-right"><span className="demo-pill">DEMO MODE</span><div className="user-chip"><span className="avatar">{initials}</span><span className="user-name">{user.name}</span></div><span className="role-badge">{user.role}</span></div></header><main className="content">{children}</main></div></div>;
}
