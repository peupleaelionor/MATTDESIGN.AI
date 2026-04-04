import { Card, Badge } from "@/components/ui";
import { AGENT_CONFIGS } from "@/config/agent-config";
import { AgentIcon } from "@/components/agent-icon";

// ─── Agents Grid Section ──────────────────────────────────────────────────────

export function AgentsSection() {
  return (
    <section id="agents" className="py-24 md:py-32 bg-[#111827]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="muted" className="mb-4">The team</Badge>
          <h2 className="md-heading text-3xl md:text-4xl lg:text-5xl text-white max-w-3xl">
            Not one AI.{" "}
            <span className="md-gradient-text">An entire team.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl">
            Each agent is an expert. Together, they outperform any single model — and any generic tool.
          </p>
        </div>

        {/* Agent cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {AGENT_CONFIGS.map((agent, index) => (
            <Card
              key={agent.id}
              hover
              className="group relative overflow-hidden"
            >
              {/* Glow accent */}
              <div
                className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity duration-300"
                style={{ background: agent.color }}
              />

              <div className="relative flex flex-col gap-3">
                {/* Icon + number */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `${agent.color}18`, border: `1px solid ${agent.color}30` }}
                  >
                    <AgentIcon
                      name={agent.icon}
                      className="h-4 w-4"
                      style={{ color: agent.color }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Name & role */}
                <div>
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{agent.role}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {agent.description}
                </p>

                {/* Accent underline */}
                <div
                  className="h-0.5 w-6 rounded-full mt-1 group-hover:w-full transition-all duration-500 ease-out"
                  style={{ background: agent.color }}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
