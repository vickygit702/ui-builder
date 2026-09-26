-- One row per reusable core component (button, dialog, card, ...).
-- Only components explicitly finalized on the frontend get status = 'finalized'.
CREATE TABLE IF NOT EXISTS core.component (
    id              SERIAL PRIMARY KEY,
    key             VARCHAR(64)  NOT NULL,
    display_name    VARCHAR(120) NOT NULL,
    description     TEXT,
    version         INTEGER      NOT NULL DEFAULT 1,
    status          VARCHAR(20)  NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uq_component_key UNIQUE (key),
    CONSTRAINT chk_component_status CHECK (status IN ('draft', 'finalized', 'deprecated')),
    CONSTRAINT chk_component_version_positive CHECK (version > 0)
);

CREATE INDEX IF NOT EXISTS idx_component_status ON core.component (status);
