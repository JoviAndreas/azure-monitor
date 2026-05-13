import { Search, Compass, Code2, ShieldCheck, Rocket, Bot } from "lucide-react";
import { AgentRole } from "@/lib/agents-data";

interface RoleIconProps {
  role: AgentRole;
  size?: number;
  className?: string;
}

export function RoleIcon({ role, size = 14, className = "" }: RoleIconProps) {
  const map = {
    investigator: Search,
    architect: Compass,
    coder: Code2,
    reviewer: ShieldCheck,
    deployer: Rocket,
  } as const;
  const Icon = map[role] ?? Bot;
  return <Icon size={size} className={className} />;
}
