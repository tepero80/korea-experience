import { env as bindings } from 'cloudflare:workers';
import entry from './index';
import { auth } from './auth';
import type { Env } from './env';

// Build the authentication routes during bounded Worker startup, alongside Hono's routes.
// Runtime schema I/O is replaced by the deployment/export validation gates.
// D1 is resolved only inside a request/cron context; no database I/O runs at startup.
const currentDatabase = () => (bindings as unknown as Env).DB;
const database: D1Database = {
  prepare: (query) => currentDatabase().prepare(query),
  batch: (statements) => currentDatabase().batch(statements),
  exec: (query) => currentDatabase().exec(query),
  withSession: (constraint) => currentDatabase().withSession(constraint),
  dump: () => currentDatabase().dump(),
};
const startup = { ...bindings, DB: database } as Env;
if (startup.COMMUNITY_ENABLED === 'true' && startup.BETTER_AUTH_SECRET?.length >= 32)
  await auth(startup).$context;

export default {
  fetch(request: Request, env: Env, context: ExecutionContext) {
    // Read current secret values on every invocation; auth() invalidates stale configuration.
    return entry.fetch(request, { ...env, DB: database }, context);
  },
  scheduled(event: ScheduledController, env: Env) {
    return entry.scheduled(event, { ...env, DB: database });
  },
};
