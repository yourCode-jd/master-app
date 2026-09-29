import { db } from "@/lib/db";
export async function audit(input: { gymId: string; actorId?: string; action: string; entityType: string; entityId: string; before?: unknown; after?: unknown }) {
  return db.auditLog.create({ data: { ...input, before: input.before ? JSON.stringify(input.before) : null, after: input.after ? JSON.stringify(input.after) : null } });
}
