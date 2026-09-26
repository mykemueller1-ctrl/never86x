CREATE TABLE IF NOT EXISTS seat_signups (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  restaurant_name text,
  source text NOT NULL,
  checks_used text NOT NULL DEFAULT '',
  consent_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL,
  activated_at timestamptz,
  unsubscribed_at timestamptz
);

CREATE TABLE IF NOT EXISTS seat_login_codes (
  id text PRIMARY KEY,
  email text NOT NULL,
  token_hash text NOT NULL UNIQUE,
  code_hash text NOT NULL,
  unsub_hash text NOT NULL,
  draft text,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz
);
