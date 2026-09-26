-- Variants (primary, secondary, outline, ...) belonging to a core.component.
-- ON DELETE CASCADE: deleting a component cleans up its variants automatically.
CREATE TABLE IF NOT EXISTS core.component_variant (
    id              SERIAL PRIMARY KEY,
    component_id    INTEGER      NOT NULL,
    variant_key     VARCHAR(64)  NOT NULL,
    label           VARCHAR(120) NOT NULL,
    class_names     TEXT         NOT NULL,
    is_default      BOOLEAN      NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT fk_component_variant_component
        FOREIGN KEY (component_id)
        REFERENCES core.component (id)
        ON DELETE CASCADE,

    CONSTRAINT uq_component_variant_key UNIQUE (component_id, variant_key)
);

CREATE INDEX IF NOT EXISTS idx_component_variant_component_id
    ON core.component_variant (component_id);
