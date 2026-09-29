import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) { return <button className={cn("button", `button-${variant}`, className)} {...props} />; }
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn("input", className)} {...props} />; }
export function Card({ children, className }: { children: ReactNode; className?: string }) { return <section className={cn("card", className)}>{children}</section>; }
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "info" }) { return <span className={`badge badge-${tone}`}>{children}</span>; }
export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="empty-state"><strong>{title}</strong><p>{description}</p></div>; }
