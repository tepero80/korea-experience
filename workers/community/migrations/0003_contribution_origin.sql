ALTER TABLE contribution ADD COLUMN author_type TEXT NOT NULL DEFAULT 'community' CHECK(author_type IN ('community','editorial'));
