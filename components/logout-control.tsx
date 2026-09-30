"use client";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
export function LogoutControl() { return <form action={logout}><button className="button button-ghost logout-button" type="submit"><LogOut size={16}/> <span>Log out</span></button></form>; }
