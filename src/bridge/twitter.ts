import OAuth from "oauth-1.0a";
import { HmacSHA1, enc } from "crypto-js";

export function oAuthHeader(env: Env, request: OAuth.RequestOptions) {
  const oAuth = new OAuth({
    consumer: {
      key: env.TWITTER_CONSUMER_KEY,
      secret: env.TWITTER_CONSUMER_SECRET,
    },
    signature_method: "HMAC-SHA1",
    hash_function(baseString, key) {
      return HmacSHA1(baseString, key).toString(enc.Base64);
    },
  });

  const oAuthToken = {
    key: env.TWITTER_ACCESS_TOKEN,
    secret: env.TWITTER_ACCESS_SECRET,
  };

  return header = oAuth.toHeader(oAuth.authorize(request, oAuthToken));
}
