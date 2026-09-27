-- Seed core Table and Card components and their variants
-- 1. Table component
INSERT INTO core.component (key, display_name, description, status)
VALUES ('table', 'Table', 'Core data table component with customizable headers, column alignments, and optional footer.', 'finalized')
ON CONFLICT (key) DO UPDATE SET display_name = EXCLUDED.display_name, status = 'finalized';

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'standard', 'Standard', 'min-w-full divide-y divide-slate-200 bg-white text-slate-800 text-sm', true FROM core.component WHERE key = 'table'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'striped', 'Striped', 'min-w-full divide-y divide-slate-200 bg-white text-slate-800 text-sm [&_tbody_tr:nth-child(even)]:bg-slate-50', false FROM core.component WHERE key = 'table'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'bordered', 'Bordered Grid', 'min-w-full border border-slate-200 divide-y divide-slate-200 bg-white text-slate-800 text-sm [&_th]:border-r [&_th]:border-slate-200 [&_td]:border-r [&_td]:border-slate-200', false FROM core.component WHERE key = 'table'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'compact', 'Compact', 'min-w-full divide-y divide-slate-200 bg-white text-slate-800 text-xs [&_th]:py-2 [&_th]:px-3 [&_td]:py-1.5 [&_td]:px-3', false FROM core.component WHERE key = 'table'
ON CONFLICT (component_id, variant_key) DO NOTHING;

-- 2. Card component
INSERT INTO core.component (key, display_name, description, status)
VALUES ('card', 'Card Grid', 'Core responsive card grid with basic shadow (md), configurable card count, gaps, corners, and heights.', 'finalized')
ON CONFLICT (key) DO UPDATE SET display_name = EXCLUDED.display_name, status = 'finalized';

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'standard', 'Standard White', 'bg-white border border-slate-200 shadow-md text-slate-900', true FROM core.component WHERE key = 'card'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'elevated', 'Elevated Darker', 'bg-white border border-slate-100 shadow-lg text-slate-900', false FROM core.component WHERE key = 'card'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'outlined', 'Outlined Flat', 'bg-slate-50/50 border border-slate-300 shadow-md text-slate-900', false FROM core.component WHERE key = 'card'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'dark', 'Dark Theme', 'bg-slate-900 border border-slate-800 shadow-md text-white', false FROM core.component WHERE key = 'card'
ON CONFLICT (component_id, variant_key) DO NOTHING;
