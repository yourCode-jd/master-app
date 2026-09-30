import type { Role } from "@/lib/permissions";

export function homeForRole(role: Role) {
  switch (role) {
    case "TRAINER": return "/trainer";
    case "RECEPTION": return "/reception";
    case "MEMBER": return "/member";
    case "OWNER":
    case "MANAGER": return "/";
  }
}
