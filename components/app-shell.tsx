"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/permissions";
import { LogoutControl } from "@/components/logout-control";
import { PageHelp } from "@/components/page-help";
import { navigationByRole } from "@/lib/navigation";

function Links({ close, role }: { close?: () => void; role?: Role }) {
  const path = usePathname();
  return (
    <nav className="nav" aria-label="Primary navigation">
      {(role ? navigationByRole[role] : []).map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          onClick={close}
          className={`nav-link ${path === href ? "active" : ""}`}
        >
          <Icon size={18} />
          {label}
        </a>
      ))}
    </nav>
  );
}
export function AppShell({
  children,
  user,
  training,
}: {
  children: React.ReactNode;
  user: { name: string; role: Role };
  training?: { scenarioId: string } | null;
}) {
  const [open, setOpen] = useState(false);
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">G</span>Gym Intelligence
        </div>
        <Links role={user.role} />
        <div className="sidebar-footer">
          DEMO MODE · All services use local simulators
        </div>
      </aside>
      {open && (
        <div
          className="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            className="drawer-backdrop"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <aside className="drawer-panel">
            <button
              className="button button-ghost drawer-close"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <X />
            </button>
            <div className="brand">
              <span className="brand-mark">G</span>Gym Intelligence
            </div>
            <Links role={user.role} close={() => setOpen(false)} />
          </aside>
        </div>
      )}
      <div className="main">
        <header className="topbar">
          <button
            className="button button-secondary mobile-menu"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div className="topbar-right"><PageHelp/>{training && <span className="training-pill">TRAINING MODE</span>}
            <span className="demo-pill">DEMO MODE</span>
            <div className="user-chip">
              <span className="avatar">{initials}</span>
              <span className="user-name">{user.name}</span>
            </div>
            <span className="role-badge">{user.role}</span><LogoutControl/>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
