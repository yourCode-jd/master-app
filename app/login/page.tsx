import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { homeForRole } from "@/lib/role-routing";
import { Dumbbell } from "lucide-react";
import { DemoLoginForm } from "@/components/demo-login-form";
import { Card } from "@/components/ui";
export default async function LoginPage() { const session = await getSession(); if (session) redirect(homeForRole(session.role)); return <main className="login-page"><Card className="login-card"><div className="brand-mark"><Dumbbell size={17}/></div><p className="eyebrow">Local-first demo</p><h1>Gym Intelligence</h1><p>Sign in to the Forge Fitness demo workspace.</p><DemoLoginForm/><div className="demo-note"><strong>Demo credentials</strong><br/>Use any seeded role email, such as owner@demo.gym, with password <code>demo123</code>. All external actions are simulated.</div></Card></main>; }
