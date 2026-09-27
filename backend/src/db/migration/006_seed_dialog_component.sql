-- Seed core Dialog component and its size variants
INSERT INTO core.component (key, display_name, description, status)
VALUES ('dialog', 'Dialog', 'Core modal dialog component with backdrop blur, dynamic content, and compact, medium, large, full sizes.', 'finalized')
ON CONFLICT (key) DO UPDATE SET display_name = EXCLUDED.display_name, status = 'finalized';

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'compact', 'Compact (Small)', 'max-w-md w-full', false FROM core.component WHERE key = 'dialog'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'medium', 'Medium (Standard)', 'max-w-2xl w-full', true FROM core.component WHERE key = 'dialog'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'large', 'Large (Spacious)', 'max-w-4xl w-full', false FROM core.component WHERE key = 'dialog'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'full', 'Full Screen', 'max-w-6xl w-[95vw] h-[90vh]', false FROM core.component WHERE key = 'dialog'
ON CONFLICT (component_id, variant_key) DO NOTHING;
