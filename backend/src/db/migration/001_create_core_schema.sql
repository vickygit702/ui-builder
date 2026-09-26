-- Namespaces every "core" (reusable component library) table under its own
-- Postgres schema so it stays cleanly separated from future Admin/Users schemas.
CREATE SCHEMA IF NOT EXISTS core;
