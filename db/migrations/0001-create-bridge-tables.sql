-- Bridge DB
create table instances (
  id integer primary key autoincrement,
  domain text not null unique,
  client_id text not null,
  client_secret text not null,
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp
);

create table users (
  id integer primary key autoincrement,
  instance_id integer not null,
  account_id text not null,
  username text not null,
  last_toot_id text,
  access_token text not null,
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp
);
