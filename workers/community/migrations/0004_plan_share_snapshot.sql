-- Reviewed public snapshots are independent of subsequent private plan edits.
-- NULL legacy links retain their token but require an owner-reviewed replacement.
ALTER TABLE plan_share ADD COLUMN public_data TEXT;
