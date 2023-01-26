import { Env } from "./env";
import { syncToots } from "./bridge";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    await syncToots(env);
    return new Response("ok");
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
		await syncToots(env);
  },
};
