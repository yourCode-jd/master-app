export const roles = ["OWNER", "MANAGER", "TRAINER", "RECEPTION", "MEMBER"] as const;
export type Role = (typeof roles)[number];
export type Permission = "dashboard:view" | "members:view" | "members:manage" | "members:write" | "settings:view" | "audit:view";

const grants: Record<Role, Permission[]> = {
  OWNER: ["dashboard:view", "members:view", "members:manage", "members:write", "settings:view", "audit:view"],
  MANAGER: ["dashboard:view", "members:view", "members:manage", "members:write"],
  TRAINER: ["dashboard:view", "members:view", "members:write"],
  RECEPTION: ["dashboard:view", "members:view"],
  MEMBER: ["dashboard:view"],
};

export function hasPermission(role: string, permission: Permission) {
  return roles.includes(role as Role) && grants[role as Role].includes(permission);
}
