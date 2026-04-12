// ─── MattDESIGN.AI — Analytics Events Scaffolding ────────────────────────────
// Lightweight event tracking layer. Currently stores in-memory.
// Ready to connect to PostHog, Mixpanel, or custom backend.

export type AnalyticsEventName =
  | "page_view"
  | "brief_started"
  | "brief_submitted"
  | "generation_started"
  | "generation_completed"
  | "generation_failed"
  | "generation_aborted"
  | "agent_started"
  | "agent_completed"
  | "critic_score"
  | "variant_compared"
  | "export_triggered"
  | "export_completed"
  | "project_saved"
  | "project_loaded"
  | "feedback_submitted"
  | "memory_recalled"
  | "license_checked"
  | "payment_initiated"
  | "first_wow";

export interface AnalyticsEvent {
  id: string;
  name: AnalyticsEventName;
  properties: Record<string, unknown>;
  timestamp: string;
  sessionId?: string;
  userId?: string;
}

// ─── In-memory event store (swap for external provider) ──────────────────────

let _events: AnalyticsEvent[] = [];
let _eventCounter = 0;

/**
 * Track an analytics event.
 * In production, this would forward to PostHog/Mixpanel/custom API.
 */
export function trackEvent(
  name: AnalyticsEventName,
  properties: Record<string, unknown> = {},
  meta?: { sessionId?: string; userId?: string },
): AnalyticsEvent {
  const event: AnalyticsEvent = {
    id: `evt-${++_eventCounter}`,
    name,
    properties,
    timestamp: new Date().toISOString(),
    sessionId: meta?.sessionId,
    userId: meta?.userId,
  };

  _events.push(event);

  // Keep last 10000 events in memory
  if (_events.length > 10000) {
    _events = _events.slice(-5000);
  }

  return event;
}

/**
 * Get all tracked events (newest first).
 */
export function getEvents(limit = 100): AnalyticsEvent[] {
  return _events.slice(-limit).reverse();
}

/**
 * Get event counts grouped by name.
 */
export function getEventCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const event of _events) {
    counts[event.name] = (counts[event.name] ?? 0) + 1;
  }
  return counts;
}

/**
 * Get funnel conversion data.
 */
export function getFunnelStats(): {
  visits: number;
  briefsStarted: number;
  briefsSubmitted: number;
  generationsStarted: number;
  generationsCompleted: number;
  exports: number;
  conversionRate: number;
} {
  const counts = getEventCounts();
  const visits = counts["page_view"] ?? 0;
  const briefsStarted = counts["brief_started"] ?? 0;
  const briefsSubmitted = counts["brief_submitted"] ?? 0;
  const generationsStarted = counts["generation_started"] ?? 0;
  const generationsCompleted = counts["generation_completed"] ?? 0;
  const exports = counts["export_triggered"] ?? 0;

  const conversionRate =
    visits > 0
      ? Math.round((generationsCompleted / visits) * 100)
      : 0;

  return {
    visits,
    briefsStarted,
    briefsSubmitted,
    generationsStarted,
    generationsCompleted,
    exports,
    conversionRate,
  };
}

/**
 * Get average critic score from tracked events.
 */
export function getAvgCriticScore(): number {
  const criticEvents = _events.filter((e) => e.name === "critic_score");
  if (criticEvents.length === 0) return 0;
  const total = criticEvents.reduce(
    (sum, e) => sum + (typeof e.properties.score === "number" ? e.properties.score : 0),
    0,
  );
  return Math.round(total / criticEvents.length);
}

/**
 * Clear all events (for testing).
 */
export function clearEvents(): void {
  _events = [];
  _eventCounter = 0;
}
