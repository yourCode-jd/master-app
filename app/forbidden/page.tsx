import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui";
export default function ForbiddenPage() { return <main className="forbidden"><Card><ShieldAlert size={28}/><h1>Permission needed</h1><p>This demo role does not have access to that area. Server-side permission checks protect routes as well as the interface.</p><a className="button button-primary" href="/">Return to dashboard</a></Card></main>; }
