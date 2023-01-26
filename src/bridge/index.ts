import type { mastodon } from "masto";
import { login } from "masto";
import { convert } from "html-to-text";
import { Env } from "../env";
import { Instance, User } from "../models";
import * as queries from "../queries";
import { oAuthHeader } from "./twitter";

/**
 * Sync tooots to twitter.
 */
export async function syncToots(env: Env) {
  const users = await env.BRIDGE_DB.prepare(queries.findUsers).all<User>();
  if (!users.success) {
    console.error(users.error);
    return;
  }

  for (const user of users.results!) {
    const toots = await getToots(env, user);
    for (const toot of toots) {
      const content = convert(toot.content, {
        selectors: [
          { selector: "a", options: { ignoreHref: true } },
        ],
      });
      await sendTweet(env, user, content);
    }
  }
}

async function getToots(env: Env, user: User): Promise<mastodon.v1.Status[]> {
  const instance = await env.BRIDGE_DB.prepare(queries.findInstanceById)
    .bind(user.instance_id)
    .first<Instance>();

  const masto = await login({ url: `https://${instance.domain}` });
  const statuses = await masto.v1.accounts.listStatuses(user.account_id, {
    excludeReplies: true,
    excludeReblogs: true,
    sinceId: user.last_toot_id,
  });
  if (statuses.length == 0) {
    return [];
  }


  await setLastTootId(env, user, statuses[0].id);

  return statuses;
}

async function setLastTootId(env: Env, user: User, tootId: string): Promise<void> {
  await env.BIDGE_DB.prepare(queries.updateUserLastTootId)
    .bind(tootId, user.id)
    .run();
}

async function sendTweet(env: Env, user: User, content: Content): Promise<void> {
  const request = {
    url: "https://api.twitter.com/1.1/statuses/update.json",
    method: "POST",
    data: { status: content },
  };

  const res = await fetch(request.url, {
    method: request.method,
    headers: {
      ...oAuthHeader(env, request),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(request.data),
  });

  if (!res.ok) {
    const message = `Failed to send tweet. (Status: ${res.status}, Message: ${await res.text()}')`;
    console.error(message);
    throw Error(message);
  }
}
