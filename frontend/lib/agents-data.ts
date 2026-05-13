export type AgentStatus = "idle" | "thinking" | "working" | "completed" | "error";
export type AgentRole = "investigator" | "architect" | "coder" | "reviewer" | "deployer";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  task: string;
  progress: number;
  thought: string;
  tokensUsed: number;
  toolCalls: number;
  gif: string;
  accent: string;
}

export const catGifs = {
  typing:   "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  keyboard: "https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif",
  coding:   "https://media.giphy.com/media/ule4vhcY1xEKQ/giphy.gif",
  busy:     "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
  laser:    "https://media.giphy.com/media/13borq7Zo46IFq/giphy.gif",
  computer: "https://media.giphy.com/media/v6aOjy0Qo1fIA/giphy.gif",
  monitor:  "https://media.giphy.com/media/3oriO7A7bt1wsEP4cw/giphy.gif",
  thinking: "https://media.giphy.com/media/3o7TKEP6YngkCKFofC/giphy.gif",
  excited:  "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
  party:    "https://media.giphy.com/media/3oEduQAsYcJKQH2XsI/giphy.gif",
};

export const initialAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Sherlock",
    role: "investigator",
    status: "working",
    task: "Audit cdn-binusacid.azureedge.net cache rules",
    progress: 67,
    thought: "CDN origin set to HTTP — should be forcing HTTPS redirect",
    tokensUsed: 12_840,
    toolCalls: 23,
    gif: catGifs.thinking,
    accent: "blue",
  },
  {
    id: "agent-2",
    name: "Atlas",
    role: "architect",
    status: "thinking",
    task: "Design HA topology for BINUS Maya across 3 regions",
    progress: 41,
    thought: "Kemanggisan + Alam Sutera + Senayan — need active-active or active-passive?",
    tokensUsed: 8_120,
    toolCalls: 11,
    gif: catGifs.computer,
    accent: "violet",
  },
  {
    id: "agent-3",
    name: "Hammer",
    role: "coder",
    status: "working",
    task: "Refactor student portal auth to Azure AD B2C",
    progress: 82,
    thought: "Writing MSAL config for student.binus.ac.id — redirect URI mismatch still",
    tokensUsed: 19_523,
    toolCalls: 47,
    gif: catGifs.typing,
    accent: "amber",
  },
  {
    id: "agent-4",
    name: "Eagle",
    role: "reviewer",
    status: "completed",
    task: "Review binusmaya DB migration 0077_sat_schema.sql",
    progress: 100,
    thought: "Approved — SAT schema migration is idempotent and has rollback script",
    tokensUsed: 5_410,
    toolCalls: 8,
    gif: catGifs.monitor,
    accent: "emerald",
  },
  {
    id: "agent-5",
    name: "Pigeon",
    role: "deployer",
    status: "idle",
    task: "Awaiting deployment trigger",
    progress: 0,
    thought: "Standing by",
    tokensUsed: 0,
    toolCalls: 0,
    gif: catGifs.busy,
    accent: "rose",
  },
];

export interface FeedEvent {
  id: number;
  agentId: string;
  agent: string;
  role: AgentRole;
  type: "thought" | "tool" | "result" | "error" | "milestone";
  message: string;
  timestamp: Date;
}

export const sampleFeedMessages: Omit<FeedEvent, "id" | "timestamp">[] = [
  // Sherlock — investigator
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "tool",      message: "az cdn endpoint show --name cdn-binusacid --profile-name binus-cdn-prod" },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "thought",   message: "Origin `binusacid.azureedge.net` caching TTL set to 0 — effectively disabled" },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "result",    message: "3 App Services on Kemanggisan RG still running B2 SKU — upgrade candidates" },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "error",     message: "Rate limited: Azure Monitor Metrics API (subscription binus-prod). Backing off 30s..." },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "tool",      message: "GET /subscriptions/binus-prod/resourceGroups/rg-kemanggisan/resources?api-version=2021-04-01" },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "thought",   message: "`newbeelajar-webapp` PremiumV3 with 8% avg CPU. Suspected over-provisioning." },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "tool",      message: "az resource list --resource-group rg-alamsutara --query \"[].{name:name,type:type,sku:sku}\"" },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "milestone", message: "Inventory complete: 218 resources scanned across 9 resource groups" },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "thought",   message: "Why does `oracle-binus-vm` have 4 public IPs? That's... concerning." },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "result",    message: "19 orphaned NICs across rg-bekasi + rg-bandung. Estimated waste: $61/mo" },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "tool",      message: "Querying diagnosticSettings for `binusmaya-prod` App Service..." },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "thought",   message: "support.binus.ac.id has no WAF rule set attached. Flagging for security review." },

  // Atlas — architect
  { agentId: "agent-2", agent: "Atlas", role: "architect", type: "milestone", message: "ADR-017 recorded: BINUS Maya session store migrates from Redis to Cosmos DB (Session API)" },
  { agentId: "agent-2", agent: "Atlas", role: "architect", type: "tool",      message: "Querying 30d metrics for `binusmaya-prod` AppService (granularity: 1h)" },
  { agentId: "agent-2", agent: "Atlas", role: "architect", type: "thought",   message: "Peak load: enrollment season. 60k concurrent students hits BINUS Maya hard every June." },
  { agentId: "agent-2", agent: "Atlas", role: "architect", type: "result",    message: "Cost model: $1,240/mo → $780/mo if we tier down 4 non-peak App Service Plans" },
  { agentId: "agent-2", agent: "Atlas", role: "architect", type: "tool",      message: "Drawing C4 diagram: student.binus.ac.id ↔ binusmaya ↔ Oracle DB ↔ Azure AD" },
  { agentId: "agent-2", agent: "Atlas", role: "architect", type: "thought",   message: "Alam Sutera campus has dedicated App Service Plan — Kemanggisan shares. Inconsistent." },
  { agentId: "agent-2", agent: "Atlas", role: "architect", type: "milestone", message: "RFC-031 drafted: Unified identity layer via Azure AD B2C for BINUSIAN Card + portal" },
  { agentId: "agent-2", agent: "Atlas", role: "architect", type: "tool",      message: "Simulating failover: rg-kemanggisan goes down → traffic to rg-alamsutara..." },
  { agentId: "agent-2", agent: "Atlas", role: "architect", type: "result",    message: "Failover sim: 99.4% traffic recovered in <45s. Acceptable for academic systems." },
  { agentId: "agent-2", agent: "Atlas", role: "architect", type: "thought",   message: "studentactivity.apps.binus.ac.id running on F1 free tier. That is not production." },

  // Hammer — coder
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "tool",      message: "Edit `infra/tf/binus-maya-plan.tf` — adding autoscale rule for enrollment season burst" },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "thought",   message: "`lifecycle { prevent_destroy = true }` on binusmaya-prod storage. Non-negotiable." },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "tool",      message: "terraform plan -var-file=prod.tfvars → 4 to add, 2 to change, 0 to destroy" },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "result",    message: "PR opened: feat/b2c-student-auth (student.binus.ac.id) — +234 -89 lines" },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "tool",      message: "npm install @azure/msal-browser @azure/msal-react → 12 packages added" },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "thought",   message: "BINUSIAN card JWT has `nim` claim — need custom attribute in B2C user flow" },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "error",     message: "ESLint: 3 errors in `src/auth/binusian-token.ts`. Auto-fixing unused imports..." },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "result",    message: "Tests: 52/52 passing. MSAL token refresh tested against staging B2C tenant." },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "tool",      message: "Write `src/services/sat-client.ts` — Student Activity Transcript API wrapper (94 lines)" },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "milestone", message: "SAT integration complete: studentactivity.apps.binus.ac.id endpoints covered" },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "thought",   message: "Walked across keyboard. Committed 'qwwwwwwwwww'. Reverting." },
  { agentId: "agent-3", agent: "Hammer", role: "coder", type: "tool",      message: "git commit -m 'feat: add MSAL redirect for student.binus.ac.id → binusmaya'" },

  // Eagle — reviewer
  { agentId: "agent-4", agent: "Eagle", role: "reviewer", type: "result",    message: "Migration 0077_sat_schema.sql approved — idempotent, rollback script present" },
  { agentId: "agent-4", agent: "Eagle", role: "reviewer", type: "thought",   message: "SAT schema uses `TEXT` for NIM. Should be `VARCHAR(10)` — flagging." },
  { agentId: "agent-4", agent: "Eagle", role: "reviewer", type: "tool",      message: "semgrep --config=p/owasp-top-ten src/auth/binusian-token.ts" },
  { agentId: "agent-4", agent: "Eagle", role: "reviewer", type: "error",     message: "Hardcoded tenant ID in `config/b2c-dev.yml:14`. Block merge — rotate immediately." },
  { agentId: "agent-4", agent: "Eagle", role: "reviewer", type: "thought",   message: "DreamSpark key committed to `infra/tf/variables.tf` 3 months ago. Still live?" },
  { agentId: "agent-4", agent: "Eagle", role: "reviewer", type: "milestone", message: "Reviewed 4 PRs today. Blocked 1 (secret leak), approved 3." },
  { agentId: "agent-4", agent: "Eagle", role: "reviewer", type: "result",    message: "No CVEs: dependency audit clean on binusmaya-frontend (0 critical, 0 high)" },
  { agentId: "agent-4", agent: "Eagle", role: "reviewer", type: "tool",      message: "Diffing `feat/b2c-student-auth` against main (312 lines changed across 11 files)" },
  { agentId: "agent-4", agent: "Eagle", role: "reviewer", type: "thought",   message: "Oracle DB connection string in plaintext in `app.config`. This is not 2009." },

  // Pigeon — deployer
  { agentId: "agent-5", agent: "Pigeon", role: "deployer", type: "thought",   message: "Ready. Pre-flight: db_migrated config_synced cdn_purged" },
  { agentId: "agent-5", agent: "Pigeon", role: "deployer", type: "tool",      message: "Pulling latest manifests from `main` — BINUS Maya v3.12.0" },
  { agentId: "agent-5", agent: "Pigeon", role: "deployer", type: "milestone", message: "Deployed binusmaya v3.12.0 to rg-staging-kemanggisan in 52 seconds" },
  { agentId: "agent-5", agent: "Pigeon", role: "deployer", type: "result",    message: "Smoke tests passing in staging. student.binus.ac.id login flow verified." },
  { agentId: "agent-5", agent: "Pigeon", role: "deployer", type: "tool",      message: "az webapp restart --name binusmaya-prod --resource-group rg-kemanggisan" },
  { agentId: "agent-5", agent: "Pigeon", role: "deployer", type: "thought",   message: "Canary at 5% traffic to Senayan campus nodes. Watching error rate..." },
  { agentId: "agent-5", agent: "Pigeon", role: "deployer", type: "error",     message: "Liveness probe failed 2/3 on binusmaya-prod. Rolling back to v3.11.9..." },
  { agentId: "agent-5", agent: "Pigeon", role: "deployer", type: "result",    message: "Rollback complete. Service stable. Root cause: Oracle JDBC driver version mismatch." },
  { agentId: "agent-5", agent: "Pigeon", role: "deployer", type: "tool",      message: "az cdn endpoint purge --name cdn-binusacid --content-paths '/*'" },
  { agentId: "agent-5", agent: "Pigeon", role: "deployer", type: "milestone", message: "CDN cache purged across all POPs. Student portal assets refreshed." },

  // Cat-flavored
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "thought",   message: "Found a NIC from 2021 attached to nothing. Named `nic-temp-DELETE-ME`. Still there." },
  { agentId: "agent-3", agent: "Hammer",   role: "coder",        type: "thought",   message: "Sat on keyboard. Opened 14 new files. Closed them all. Focus restored." },
  { agentId: "agent-2", agent: "Atlas",    role: "architect",    type: "thought",   message: "Knocked the coffee onto the whiteboard diagram. Architecturally significant event." },
  { agentId: "agent-4", agent: "Eagle",    role: "reviewer",     type: "milestone", message: "Achievement: 100 PRs reviewed. 31% required security fixes." },
  { agentId: "agent-5", agent: "Pigeon",   role: "deployer",     type: "thought",   message: "Sniffing the Helm values.yaml... smells like prod credentials in staging config." },
  { agentId: "agent-1", agent: "Sherlock", role: "investigator", type: "error",     message: "Lost the trail. *paws at terminal for 3 minutes*" },
  { agentId: "agent-3", agent: "Hammer",   role: "coder",        type: "result",    message: "Type errors resolved. TypeScript compiler is finally purring." },
  { agentId: "agent-2", agent: "Atlas",    role: "architect",    type: "tool",      message: "Reading: 'Distributed Systems for Cats Who Refuse to Accept Eventual Consistency'" },
  { agentId: "agent-4", agent: "Eagle",    role: "reviewer",     type: "thought",   message: "Variable name: `data_temp_final2_REAL_v3`. Filing this under crimes." },
  { agentId: "agent-5", agent: "Pigeon",   role: "deployer",     type: "milestone", message: "Zero-downtime deploy to all 6 campus App Services. Cats always land on their feet." },
];

export const taskPipeline = [
  { stage: "Queued",       count: 12, color: "white" },
  { stage: "Investigating", count: 3, color: "blue" },
  { stage: "Designing",    count: 2,  color: "violet" },
  { stage: "Implementing", count: 4,  color: "amber" },
  { stage: "Review",       count: 1,  color: "emerald" },
  { stage: "Deployed",     count: 28, color: "rose" },
];

export const taskTemplates: Record<AgentRole, string[]> = {
  investigator: [
    "Audit cdn-binusacid.azureedge.net cache rules",
    "Scan rg-kemanggisan for misconfigured App Services",
    "Identify orphaned NICs across all campus RGs",
    "Trace slow response on support.binus.ac.id",
    "Profile Oracle BINUS DB query latency",
    "Hunt deprecated API versions in rg-alamsutara",
    "Detect drift between Terraform state and rg-senayan",
    "Review IAM assignments in binus-prod subscription",
    "Audit studentactivity.apps.binus.ac.id uptime logs",
    "Check binusmaya-prod storage account access tiers",
  ],
  architect: [
    "Design HA topology for BINUS Maya across 3 regions",
    "Model enrollment-season burst capacity for binusmaya",
    "Draft RFC-031: unified identity via Azure AD B2C",
    "Plan blue-green deploy for student.binus.ac.id",
    "Estimate cost of Cosmos DB for SAT session store",
    "Architect read replica for Oracle BINUS team workloads",
    "Compare AKS vs Container Apps for newbeelajar platform",
    "Design CDN caching strategy for BINUS Maya assets",
    "Model multi-campus failover: Kemanggisan → Alam Sutera",
  ],
  coder: [
    "Refactor student portal auth to Azure AD B2C",
    "Write SAT API client for studentactivity.apps.binus.ac.id",
    "Add OpenTelemetry to binusmaya-prod App Service",
    "Generate Terraform for new rg-bandung App Service Plan",
    "Implement enrollment-season autoscale rules",
    "Migrate BINUSIAN Card JWT to custom B2C user flow",
    "Wire Prometheus scrape config to BINUS Maya pods",
    "Bump MSAL library — v3.x breaking change review",
    "Write integration tests for SAT score ingestion pipeline",
  ],
  reviewer: [
    "Review binusmaya DB migration 0077_sat_schema.sql",
    "Audit PR #88: feat/b2c-student-auth",
    "Inspect CSP headers on student.binus.ac.id",
    "Validate IaC drift report for rg-kemanggisan",
    "Triage SonarQube findings on binusmaya-frontend",
    "Sign off on RFC-031: BINUSIAN Card identity layer",
    "Review Oracle BINUS connection string secrets rotation",
    "Check Dockerfile layer cache: binusmaya-collector",
  ],
  deployer: [
    "Awaiting deployment trigger",
    "Deploying binusmaya v3.12.0 to rg-staging",
    "Promoting build to rg-kemanggisan prod",
    "Running canary at 5% — Senayan campus nodes",
    "Rolling back binusmaya-prod to v3.11.9",
    "Purging cdn-binusacid.azureedge.net cache",
    "Warming App Service instances post-scale-up",
    "Draining old slot — binusmaya-staging",
  ],
};

export const thoughtTemplates: Record<AgentRole, string[]> = {
  investigator: [
    "Sniffing the Azure logs...",
    "CDN origin still on HTTP. This is a 2024 problem.",
    "Why does oracle-binus-vm have 4 public IPs?",
    "NIC from 2021 named `DELETE-ME` still attached.",
    "Smells like budget waste in rg-bekasi",
    "Cross-referencing campus tags against cost center matrix",
    "studentactivity.apps.binus.ac.id on F1 free tier. Not good.",
    "DreamSpark key in Terraform vars. Still live. Rotating.",
  ],
  architect: [
    "Enrollment season: 60k concurrent students. Plan for it.",
    "Kemanggisan shares App Plan, Alam Sutera has dedicated. Inconsistent.",
    "Active-active or active-passive? SAT data can't be lost.",
    "CAP theorem demands a choice. BINUS Maya chooses availability.",
    "BINUSIAN Card JWT needs NIM + campus claims in B2C flow",
    "*strokes whiskers* What if BINUS Maya ran on Container Apps?",
    "Cost model converging at $780/mo — down from $1,240",
  ],
  coder: [
    "MSAL redirect URI mismatch on student.binus.ac.id. Again.",
    "B2C custom policy XML is... verbose.",
    "SAT schema needs VARCHAR(10) for NIM, not TEXT",
    "Walked across keyboard. Committed 'qwwwwwwwwww'. Reverting.",
    "`nim` claim not in default B2C token. Writing custom attribute.",
    "TypeScript is upset about the Oracle JDBC types. Understandable.",
    "Writing tests first. Like a disciplined BINUSIAN.",
    "ESLint demands attention on binusian-token.ts",
  ],
  reviewer: [
    "Oracle connection string in plaintext. Not acceptable.",
    "Tenant ID hardcoded in b2c-dev.yml. Blocking merge.",
    "sees `any` in SAT client. Is displeased.",
    "NIM as TEXT column? Flag it. Rotate the schema.",
    "This auth flow has no PKCE. That is a 2024 problem.",
    "Comments explain WHY, not what. Rare. Appreciated.",
    "DreamSpark key in git history 3 months. Is it rotated?",
  ],
  deployer: [
    "Pre-flight: db_migrated config_synced cdn_purged",
    "Sniffing Helm values.yaml... prod creds in staging config?",
    "Canary watching Senayan campus error rate. Holding.",
    "Caught the deploy mid-air. Zero downtime.",
    "Oracle JDBC driver mismatch caused the rollback. Fixed.",
    "CDN purged across all POPs. Students get fresh assets.",
    "Watching binusmaya error rate on all 6 campus nodes.",
  ],
};

export const errorThoughts = [
  "Azure Monitor API rate limited. Hissing.",
  "Permission denied on rg-kemanggisan. Pawing at the gate.",
  "Oracle JDBC timeout. Patience is a virtue.",
  "B2C tenant token expired. Reaching for refresh...",
  "BINUS Maya health probe failed. Tail flicking.",
  "cdn-binusacid purge job timed out. Retrying.",
];

export const chatResponses: Record<AgentRole, string[]> = {
  investigator: [
    "On it. Pulling resource inventory for that subscription now.",
    "Already flagged that — 3 NICs in rg-kemanggisan with no owner tag since March.",
    "The cdn-binusacid origin still serves HTTP. Should force HTTPS redirect.",
    "Interesting timing. I was tracing a latency spike on support.binus.ac.id just now.",
    "That IP doesn't match any registered campus gateway. Needs a ticket.",
    "Found it — `oracle-binus-vm` has a public IP with no NSG attached. Blocking.",
    "studentactivity.apps.binus.ac.id is on Free tier. Not surviving enrollment season.",
    "Cross-referencing now. Give me 30 seconds.",
    "Logging that in the audit trail. Owner: ICT Directorate.",
    "Azure Resource Graph shows 218 resources, but only 190 tagged. Gap of 28.",
  ],
  architect: [
    "Enrollment season peaks at 60k concurrent. Current plan won't hold.",
    "Recommend active-passive for SAT data — can't afford split-brain on student records.",
    "RFC-031 covers this — BINUSIAN Card JWT needs `nim` + `campus` claims in B2C.",
    "Cost model says $780/mo is achievable. Kemanggisan App Plan is over-provisioned.",
    "Container Apps vs AKS: BINUS Maya stays on AKS. newbeelajar can use Container Apps.",
    "Read replica on Oracle side would cut binusmaya-prod query load by ~40%.",
    "Kemanggisan → Alam Sutera failover under 45s in simulation.",
    "CDN caching strategy needs updating. TTL is 0 right now. Effectively disabled.",
    "Multi-campus routing inconsistent — Alam Sutera has dedicated plan, Kemanggisan shares.",
    "Blue-green for student.binus.ac.id is the move. Can't afford downtime mid-semester.",
  ],
  coder: [
    "Writing the MSAL config now. Redirect URI mismatch is the usual suspect.",
    "B2C custom policy XML is verbose but the SAT claims are wired up.",
    "The `nim` claim isn't in the default token. Added as a custom B2C attribute.",
    "TypeScript is complaining about Oracle JDBC types. Wrapping in `unknown` for now.",
    "PR open — feat/b2c-student-auth. 234 additions, 89 deletions.",
    "52/52 tests passing. MSAL token refresh tested against staging B2C tenant.",
    "SAT API client done — studentactivity.apps.binus.ac.id endpoints covered.",
    "Terraform plan clean: 4 to add, 2 to change, 0 to destroy.",
    "Walked across keyboard earlier. Committed 'qwwwww'. Already reverted.",
    "Autoscale rule drafted for enrollment season burst. Max 10 instances.",
  ],
  reviewer: [
    "Blocked that PR — tenant ID hardcoded in `b2c-dev.yml:14`. Rotate before merge.",
    "SAT schema uses TEXT for NIM. Should be VARCHAR(10). Flagged.",
    "No PKCE on this auth flow. Not approving until fixed.",
    "Semgrep clean on changed files. No OWASP top-10 hits this time.",
    "DreamSpark key in git history 3 months ago. Confirmed rotated? Need proof.",
    "Oracle connection string plaintext in app.config. Block, rotate, vault it.",
    "Coverage at 89% on SAT client. Approving with minor note.",
    "Variable name `data_temp_final2_REAL_v3` — added a comment. Please rename.",
    "3 PRs today. Approved 2, blocked 1 for secret leak.",
    "Dockerfile fine — layers cached correctly. No unnecessary RUN stacking.",
  ],
  deployer: [
    "Pre-flight done: db_migrated, config_synced, cdn_purged. Ready.",
    "Canary at 5% to Senayan nodes. Error rate 0.02%. Normal.",
    "CDN purged across all POPs. Students get fresh assets on next request.",
    "Rollback complete. Root cause: Oracle JDBC driver version mismatch.",
    "binusmaya v3.12.0 to staging in 52 seconds. Smoke tests passing.",
    "Zero downtime confirmed across all 6 campus App Services.",
    "Helm upgrade complete — rg-kemanggisan prod slot warmed.",
    "Liveness probe recovered. Keeping an eye on it.",
    "Draining old slot now. Under 2 minutes.",
    "Promoting to prod. Estimated: 47 seconds.",
  ],
};
