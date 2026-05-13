import { Globe, Package, Database, Server, Zap, Layers, HardDrive, Wind } from "lucide-react";
import { ResourceType } from "./types";

export function ResourceTypeIcon({ type, size = 15 }: { type: ResourceType; size?: number }) {
  const cls = "shrink-0";
  const map: Record<ResourceType, React.ReactNode> = {
    "app-service":      <Globe     size={size} className={cls} />,
    "app-service-plan": <Package   size={size} className={cls} />,
    "sql-database":     <Database  size={size} className={cls} />,
    postgresql:         <Database  size={size} className={cls} />,
    mysql:              <Database  size={size} className={cls} />,
    cosmosdb:           <Wind      size={size} className={cls} />,
    redis:              <Zap       size={size} className={cls} />,
    aks:                <Layers    size={size} className={cls} />,
    storage:            <HardDrive size={size} className={cls} />,
  };
  return <>{map[type] ?? <Server size={size} className={cls} />}</>;
}
