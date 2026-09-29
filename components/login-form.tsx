"use client";
import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";
import { Button, Input } from "@/components/ui";
const initialState: LoginState = {};
export function LoginForm() { const [state, action, pending] = useActionState(login, initialState); return <form action={action}><div className="form-field"><label htmlFor="email">Email</label><Input id="email" name="email" type="email" autoComplete="email" defaultValue="owner@demo.gym" required /></div><div className="form-field"><label htmlFor="password">Password</label><Input id="password" name="password" type="password" autoComplete="current-password" defaultValue="demo123" required /></div>{state.error && <p className="form-error" role="alert">{state.error}</p>}<Button type="submit" disabled={pending} className="login-submit">{pending ? "Signing in…" : "Enter demo"}</Button></form>; }
