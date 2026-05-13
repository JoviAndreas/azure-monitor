"use client";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { AgentCard } from "@/components/AgentCard";
import { LiveFeed } from "@/components/LiveFeed";
import { TaskPipeline } from "@/components/TaskPipeline";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Agent, initialAgents, catGifs, taskTemplates, thoughtTemplates, errorThoughts, chatResponses } from "@/lib/agents-data";
import { useToast } from "@/lib/toast";
import { Cpu, DollarSign, Hash, Plus, Sparkles, Zap, Activity, Send, Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function liveTick(a: Agent, idleTimers: Record<string, number>): Agent {
  if (a.status === "idle") {
    if (Math.random() < 0.12) {
      return {
        ...a,
        status: "thinking",
        task: pick(taskTemplates[a.role]),
        thought: pick(thoughtTemplates[a.role]),
        progress: 1 + Math.random() * 5,
      };
    }
    return a;
  }

  if (a.status === "completed") {
    idleTimers[a.id] = (idleTimers[a.id] ?? 0) + 1;
    if (idleTimers[a.id] >= 3) {
      idleTimers[a.id] = 0;
      const goIdle = Math.random() < 0.25;
      return {
        ...a,
        status: goIdle ? "idle" : "thinking",
        task: goIdle ? "Awaiting next assignment" : pick(taskTemplates[a.role]),
        thought: goIdle ? "Napping" : pick(thoughtTemplates[a.role]),
        progress: goIdle ? 0 : 2 + Math.random() * 4,
      };
    }
    return a;
  }

  if (a.status === "error") {
    if (Math.random() < 0.5) {
      return { ...a, status: "working", thought: pick(thoughtTemplates[a.role]) };
    }
    return a;
  }

  const speed = a.status === "thinking" ? 2 + Math.random() * 3 : 4 + Math.random() * 6;
  const next = Math.min(100, a.progress + speed);

  let newStatus = a.status;
  if (a.status === "thinking" && next > 20 && Math.random() < 0.5) newStatus = "working";

  if (a.status === "working" && Math.random() < 0.02) {
    return { ...a, status: "error", thought: pick(errorThoughts) };
  }

  if (next >= 100) {
    return { ...a, progress: 100, status: "completed", thought: "Done. Nap time soon." };
  }

  const newThought = Math.random() < 0.22 ? pick(thoughtTemplates[a.role]) : a.thought;

  return {
    ...a,
    status: newStatus,
    progress: next,
    thought: newThought,
    tokensUsed: a.tokensUsed + Math.floor(80 + Math.random() * 480),
    toolCalls: a.toolCalls + (Math.random() > 0.6 ? 1 : 0),
  };
}

const extraAgents: Agent[] = [
  { id: "agent-6", name: "Whiskers", role: "investigator", status: "thinking", task: "Audit IAM roles in binus-prod subscription", progress: 22, thought: "Who is `svc-legacy-admin`? No owner tag since 2022.", tokensUsed: 4_210, toolCalls: 7, gif: catGifs.excited, accent: "blue" },
  { id: "agent-7", name: "Biscuit", role: "coder", status: "working", task: "Add OpenTelemetry to binusmaya-prod App Service", progress: 56, thought: "async/await is just promises with manners", tokensUsed: 14_882, toolCalls: 31, gif: catGifs.monitor, accent: "amber" },
  { id: "agent-8", name: "Pumpkin", role: "reviewer", status: "working", task: "Audit PR #88: feat/b2c-student-auth", progress: 73, thought: "No PKCE on this flow. That is a 2024 problem.", tokensUsed: 6_120, toolCalls: 14, gif: catGifs.party, accent: "emerald" },
];

interface ChatMessage {
  from: "user" | "agent";
  text: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([...initialAgents, ...extraAgents]);
  const [spawnOpen, setSpawnOpen] = useState(false);
  const [chatAgent, setChatAgent] = useState<Agent | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const idleTimers = useRef<Record<string, number>>({});
  const { push } = useToast();

  useEffect(() => {
    const id = setInterval(
      () => setAgents((prev) => prev.map((a) => liveTick(a, idleTimers.current))),
      700
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatTyping]);

  function openChat(agent: Agent) {
    setChatAgent(agent);
    setChatMessages([
      { from: "agent", text: `Hey. ${agent.name} here — ${agent.role}. Currently: ${agent.task}. What do you need?` },
    ]);
    setChatInput("");
    setChatTyping(false);
  }

  function sendMessage() {
    const text = chatInput.trim();
    if (!text || chatTyping || !chatAgent) return;
    setChatInput("");
    setChatMessages((prev) => [...prev, { from: "user", text }]);
    setChatTyping(true);
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const response = pick(chatResponses[chatAgent.role]);
      setChatMessages((prev) => [...prev, { from: "agent", text: response }]);
      setChatTyping(false);
    }, delay);
  }

  function wakeAll() {
    setAgents((prev) =>
      prev.map((a) =>
        a.status === "idle"
          ? {
              ...a,
              status: "thinking",
              task: pick(taskTemplates[a.role]),
              thought: pick(thoughtTemplates[a.role]),
              progress: 1 + Math.random() * 5,
            }
          : a
      )
    );
    push({ kind: "success", title: "All agents woken", message: "Sleepy cats now coding" });
  }

  const totalTokens = agents.reduce((sum, a) => sum + a.tokensUsed, 0);
  const totalToolCalls = agents.reduce((sum, a) => sum + a.toolCalls, 0);
  const activeAgents = agents.filter((a) => a.status === "working" || a.status === "thinking").length;
  const errorAgents = agents.filter((a) => a.status === "error").length;
  const estCost = (totalTokens / 1_000_000) * 3.0;

  const healthState = errorAgents > 0 ? "error" : activeAgents > agents.length * 0.5 ? "active" : activeAgents > 0 ? "stable" : "stable";

  useEffect(() => {
    document.body.dataset.health = healthState;
  }, [healthState]);


  // Hero: working agent with highest progress
  const heroAgent = agents
    .filter((a) => a.status === "working")
    .sort((a, b) => b.progress - a.progress)[0] ?? null;

  const byRole = (role: string) => agents.filter((a) => a.role === role && (a.status === "working" || a.status === "thinking")).length;
  const completedCount = agents.filter((a) => a.status === "completed").length;
  const queuedCount = agents.filter((a) => a.status === "idle").length + 8;
  const pipelineStages = [
    { stage: "Queued", count: queuedCount, color: "white" },
    { stage: "Investigating", count: byRole("investigator"), color: "blue" },
    { stage: "Designing", count: byRole("architect"), color: "violet" },
    { stage: "Implementing", count: byRole("coder"), color: "amber" },
    { stage: "Review", count: byRole("reviewer"), color: "emerald" },
    { stage: "Deployed", count: 28 + completedCount, color: "rose" },
  ];

  function spawnAgent() {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: pick(["Whiskers", "Mittens", "Biscuit", "Pumpkin", "Noodle", "Tuna", "Mocha", "Pepper"]),
      role: pick(["investigator", "architect", "coder", "reviewer"]) as Agent["role"],
      status: "thinking",
      task: "Initializing — reading project context...",
      progress: 2,
      thought: "Where am I? What am I doing?",
      tokensUsed: 0,
      toolCalls: 0,
      gif: pick(Object.values(catGifs)),
      accent: pick(["blue", "violet", "amber", "emerald", "rose"]),
    };
    setAgents((prev) => [newAgent, ...prev]);
    setSpawnOpen(false);
    push({ kind: "success", title: `Spawned ${newAgent.name}`, message: `${newAgent.role} agent is initializing` });
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <TopBar />

        <main className="flex-1 flex flex-col min-h-0 px-8 py-6 w-full overflow-hidden">
          {/* Header */}
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <h1 className="text-display text-white">AI Agents</h1>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <span className="dot dot-pulse bg-emerald-400"></span>
                  {activeAgents} active
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  <Activity size={10} />
                  live
                </span>
              </div>
              <p className="text-body text-white/45">
                Autonomous AI agents working on your Azure infrastructure. Click any agent to chat.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={wakeAll} className="btn-secondary rounded-md px-3 py-1.5 text-[13px] font-medium flex items-center gap-1.5">
                <Zap size={13} />
                Wake all
              </button>
              <button onClick={() => setSpawnOpen(true)} className="btn-gold rounded-md px-3 py-1.5 text-[13px] font-medium flex items-center gap-1.5">
                <Plus size={13} />
                Spawn agent
              </button>
            </div>
          </div>

          {/* Two-column layout: left = stats+pipeline+agents, right = live feed */}
          <div className="flex-1 min-h-0 grid grid-cols-1 2xl:grid-cols-[1fr_460px] gap-5 items-stretch">

            {/* Left column */}
            <div className="flex flex-col gap-4 min-h-0">
              {/* Stats strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Sparkles, color: "text-cyan-300",    bg: "bg-cyan-400/10",    value: <AnimatedNumber value={agents.length} />,                                   label: "Agents" },
                  { icon: Hash,     color: "text-violet-300",  bg: "bg-violet-500/10",  value: <AnimatedNumber value={totalTokens} />,                                     label: "Tokens" },
                  { icon: Cpu,      color: "text-emerald-300", bg: "bg-emerald-500/10", value: <AnimatedNumber value={totalToolCalls} />,                                   label: "Tool Calls" },
                  { icon: DollarSign, color: "text-amber-300", bg: "bg-amber-500/10",   value: <>${<AnimatedNumber value={estCost} format={(n) => n.toFixed(3)} />}</>,     label: "Est. Cost" },
                ].map(({ icon: Icon, color, bg, value, label }) => (
                  <div key={label} className="surface rounded-xl p-4 flex items-center gap-4 hover:border-white/[0.12] transition-colors">
                    <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={16} className={color} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[28px] font-bold tnum leading-none tracking-tight ${color}`}>{value}</p>
                      <p className="text-[11px] text-white/35 mt-1 font-medium uppercase tracking-wider">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pipeline */}
              <TaskPipeline stages={pipelineStages} />

              {/* Agents grid */}
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
                {agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} onClick={() => openChat(agent)} hero={heroAgent?.id === agent.id} />
                ))}
              </div>
            </div>


            {/* Right column — live feed, full height */}
            <div className="hidden 2xl:flex flex-col min-h-0">
              <LiveFeed />
            </div>
          </div>
        </main>
      </div>

      {/* Spawn modal */}
      <Modal
        open={spawnOpen}
        onClose={() => setSpawnOpen(false)}
        title="Spawn new agent"
        subtitle="Pick a role — assign a task — let the work begin"
        footer={
          <>
            <button onClick={() => setSpawnOpen(false)} className="btn-secondary rounded-md px-3 py-1.5 text-[13px] font-medium">
              Cancel
            </button>
            <button onClick={spawnAgent} className="btn-gold rounded-md px-3 py-1.5 text-[13px] font-medium">
              Spawn
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="aspect-video rounded-lg overflow-hidden bg-black/30">
            <img src={catGifs.excited} alt="agent preview" className="w-full h-full object-cover" />
          </div>
          <p className="text-[13px] text-white/70 leading-relaxed">
            New agent will be initialized with default tools (Read, Edit, Bash, Grep) and access to the current workspace context. Token usage will be billed to your tenant.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="surface-elevated rounded-md p-2">
              <p className="text-white/35 uppercase tracking-wider mb-1 text-[9px]">Model</p>
              <p className="text-white">claude-sonnet-4.5</p>
            </div>
            <div className="surface-elevated rounded-md p-2">
              <p className="text-white/35 uppercase tracking-wider mb-1 text-[9px]">Budget</p>
              <p className="text-white">100k tokens</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Chat modal */}
      <Modal
        open={!!chatAgent}
        onClose={() => setChatAgent(null)}
        title={chatAgent ? `${chatAgent.name}` : ""}
        subtitle={chatAgent ? `${chatAgent.role} · ${chatAgent.task}` : ""}
        size="md"
      >
        {chatAgent && (
          <div className="flex flex-col gap-3">
            {/* Messages */}
            <div className="h-56 overflow-y-auto scrollbar-thin space-y-2 pr-1">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-[12px] leading-relaxed ${
                    msg.from === "user"
                      ? "bg-blue-600/30 text-blue-100 border border-blue-500/20"
                      : "bg-white/[0.06] text-white/80 border border-white/[0.08]"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2 flex items-center gap-1.5">
                    <Loader2 size={11} className="animate-spin text-white/40" />
                    <span className="text-[11px] text-white/35 italic">{chatAgent.name} is typing...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                autoFocus
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={`Message ${chatAgent.name}...`}
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-[13px] text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!chatInput.trim() || chatTyping}
                className="btn-gold rounded-lg px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
