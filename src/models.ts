export type Instance = {
  domain: string;
  client_id: string;
  client_secret: string;
};

export type User = {
  instance_id: number;
  account_id: string;
  username: string;
  last_toot_id: string | null;
  access_token: string;
}
