-- Create users schema and user workspace tables: account, project, page, component_instance, project_export

CREATE SCHEMA IF NOT EXISTS users;

-- 1. User accounts
CREATE TABLE IF NOT EXISTS users.account (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    role            VARCHAR(50)  NOT NULL DEFAULT 'user',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Seed default user (user@gmail.com / password123)
INSERT INTO users.account (email, password, role)
VALUES ('user@gmail.com', 'password123', 'user')
ON CONFLICT (email) DO NOTHING;

-- 2. Projects
CREATE TABLE IF NOT EXISTS users.project (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users.account(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 3. Pages / Routes
CREATE TABLE IF NOT EXISTS users.page (
    id              SERIAL PRIMARY KEY,
    project_id      INTEGER REFERENCES users.project(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    path            VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_project_page_path UNIQUE (project_id, path)
);

-- 4. Component instances placed on a page
CREATE TABLE IF NOT EXISTS users.component_instance (
    id                  SERIAL PRIMARY KEY,
    page_id             INTEGER REFERENCES users.page(id) ON DELETE CASCADE,
    core_component_id   INTEGER REFERENCES core.component(id) ON DELETE SET NULL,
    core_variant_id     INTEGER REFERENCES core.component_variant(id) ON DELETE SET NULL,
    instance_key        VARCHAR(100) NOT NULL,
    component_type      VARCHAR(100) NOT NULL,
    props               JSONB        NOT NULL DEFAULT '{}'::jsonb,
    position            JSONB        NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb,
    order_index         INTEGER      NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 5. Export artifacts & manifest
CREATE TABLE IF NOT EXISTS users.project_export (
    id              SERIAL PRIMARY KEY,
    project_id      INTEGER REFERENCES users.project(id) ON DELETE CASCADE,
    status          VARCHAR(50) NOT NULL DEFAULT 'completed',
    manifest        JSONB       NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_page_project ON users.page (project_id);
CREATE INDEX IF NOT EXISTS idx_users_component_instance_page ON users.component_instance (page_id);
