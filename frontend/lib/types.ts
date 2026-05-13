export type ResourceType =
  | "app-service"
  | "app-service-plan"
  | "sql-database"
  | "postgresql"
  | "mysql"
  | "cosmosdb"
  | "redis"
  | "aks"
  | "storage";

export type ResourceStatus = "healthy" | "warning" | "critical" | "unknown";
export type Recommendation = "upgrade" | "downgrade" | "ok" | "review";

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface ResourceMetrics {
  cpu: MetricPoint[];
  memory: MetricPoint[];
  dtu?: MetricPoint[];
  connections?: MetricPoint[];
  requests?: MetricPoint[];
}

export interface AzureResource {
  id: string;
  name: string;
  type: ResourceType;
  resourceGroup: string;
  subscription: string;
  location: string;
  sku: string;
  tier: string;
  status: ResourceStatus;
  recommendation: Recommendation;
  metrics: {
    cpuAvg: number;
    cpuMax: number;
    memoryAvg: number;
    memoryMax: number;
    dtuAvg?: number;
    dtuMax?: number;
    requestsPerMin?: number;
    connectionsAvg?: number;
  };
  tags: Record<string, string>;
  lastUpdated: string;
}

export interface DashboardSummary {
  total: number;
  healthy: number;
  warning: number;
  critical: number;
  upgradeNeeded: number;
  downgradeOpportunity: number;
}
