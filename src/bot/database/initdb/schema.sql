CREATE TABLE IF NOT EXISTS "guilds" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "native_guild_id" bigint UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "guild_settings" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,

  "guild" integer UNIQUE NOT NULL
    REFERENCES guilds(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,

  "suppress_embeds" boolean NOT NULL DEFAULT true,

  "delete_original_message" boolean NOT NULL DEFAULT false,
  "mention_user_in_reply" boolean NOT NULL DEFAULT false,

  "fix_instagram" boolean NOT NULL DEFAULT true,
  "fix_reddit" boolean NOT NULL DEFAULT true,
  "fix_tiktok" boolean NOT NULL DEFAULT true,
  "fix_twitter" boolean NOT NULL DEFAULT true,
  "fix_yt_shorts" boolean NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_guilds_id ON "guilds" ("id");

CREATE UNIQUE INDEX IF NOT EXISTS ux_guilds_native_guild_id ON "guilds" ("native_guild_id");

CREATE UNIQUE INDEX IF NOT EXISTS ux_settings_guild ON "settings" ("guild");

COMMENT ON COLUMN "guilds"."native_guild_id" IS 'Discord Server ID';
