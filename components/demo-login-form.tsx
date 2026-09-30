"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "@/app/actions/auth";
import { Button, Input } from "@/components/ui";

const accounts = [
  ["Owner", "owner@demo.gym"],
  ["Manager", "manager@demo.gym"],
  ["Trainer", "trainer@demo.gym"],
  ["Reception", "reception@demo.gym"],
  ["Member", "member@demo.gym"],
] as const;
const initialState: LoginState = {};

export function DemoLoginForm() {
  const [state, action, pending] = useActionState(login, initialState);
  const [email, setEmail] = useState("owner@demo.gym");
  const [password, setPassword] = useState("demo123");
  return <form action={action} className="demo-login-form">
    <div className="form-field"><label htmlFor="email">Email</label><Input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
    <div className="form-field"><label htmlFor="password">Password</label><Input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    <Button type="submit" disabled={pending} className="login-submit">{pending ? "Signing in…" : "Enter demo"}</Button>
    <div className="demo-account-list" aria-label="Fill demo credentials"><p>Quick-fill a demo role</p><div>{accounts.map(([label, account]) => <button type="button" className="demo-account" onClick={() => { setEmail(account); setPassword("demo123"); }} key={account}><strong>{label}</strong><span>{account}</span></button>)}</div><small>Password for every demo account: <code>demo123</code></small></div>
  </form>;
}
