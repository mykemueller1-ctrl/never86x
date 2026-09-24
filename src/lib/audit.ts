export type AuditEvent = {
  at: string;
  actor: string;
  action: string;
  target?: string;
  meta?: Record<string, unknown>;
};

const mem: AuditEvent[] = [];

export function writeAudit(event: Omit<AuditEvent, "at"> & { at?: string }) {
  const row: AuditEvent = {
    at: event.at ?? new Date().toISOString(),
    actor: event.actor,
    action: event.action,
    target: event.target,
    meta: event.meta,
  };
  mem.push(row);
  if (mem.length > 500) mem.shift();
  console.info(JSON.stringify({ type: "audit", ...row }));
  return row;
}

export function listAudit(limit = 50) {
  return mem.slice(-limit).reverse();
}
