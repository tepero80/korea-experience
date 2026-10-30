-- Auth tables are generated separately by the pinned Better Auth configuration.
CREATE TABLE profile(id TEXT PRIMARY KEY,auth_user_id TEXT UNIQUE REFERENCES user(id) ON DELETE SET NULL,name TEXT NOT NULL,blocked INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE contribution(id TEXT PRIMARY KEY,profile_id TEXT REFERENCES profile(id) ON DELETE SET NULL,kind TEXT NOT NULL CHECK(kind IN ('question','report','update','comment')),guide_id TEXT,parent_id TEXT REFERENCES contribution(id) ON DELETE CASCADE,title TEXT NOT NULL DEFAULT '',body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','published','hidden','deleted')),indexable INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,revision INTEGER NOT NULL DEFAULT 1);
CREATE INDEX contribution_public ON contribution(status,kind,created_at);
CREATE INDEX contribution_guide ON contribution(guide_id,status);
CREATE TABLE revision(id TEXT PRIMARY KEY,contribution_id TEXT NOT NULL REFERENCES contribution(id) ON DELETE CASCADE,title TEXT NOT NULL,body TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE reaction(profile_id TEXT NOT NULL REFERENCES profile(id) ON DELETE CASCADE,target_id TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(profile_id,target_id));
CREATE TABLE saved(profile_id TEXT NOT NULL REFERENCES profile(id) ON DELETE CASCADE,guide_id TEXT NOT NULL,PRIMARY KEY(profile_id,guide_id));
CREATE TABLE plan(id TEXT PRIMARY KEY,profile_id TEXT NOT NULL REFERENCES profile(id) ON DELETE CASCADE,title TEXT NOT NULL,data TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE plan_share(token_hash TEXT PRIMARY KEY,plan_id TEXT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE report(id TEXT PRIMARY KEY,profile_id TEXT REFERENCES profile(id) ON DELETE SET NULL,contribution_id TEXT NOT NULL REFERENCES contribution(id) ON DELETE CASCADE,reason TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'open',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE moderation_log(id TEXT PRIMARY KEY,actor_id TEXT REFERENCES profile(id) ON DELETE SET NULL,target_id TEXT NOT NULL,action TEXT NOT NULL,reason TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE request_limit(id TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL);
CREATE INDEX request_expiry ON request_limit(expires_at);
CREATE TABLE mail_budget(month TEXT PRIMARY KEY,day TEXT NOT NULL,day_count INTEGER NOT NULL,month_count INTEGER NOT NULL);
