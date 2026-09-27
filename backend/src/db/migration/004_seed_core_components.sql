-- Seed core components: button, header, sidebar, footer into core.component and core.component_variant

-- 1. Button
INSERT INTO core.component (key, display_name, description, status)
VALUES ('button', 'Button', 'Core reusable button component with style variants.', 'finalized')
ON CONFLICT (key) DO UPDATE SET display_name = EXCLUDED.display_name, status = 'finalized';

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'primary', 'Primary', 'bg-indigo-600 text-white hover:bg-indigo-700', true FROM core.component WHERE key = 'button'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'secondary', 'Secondary', 'bg-slate-200 text-slate-900 hover:bg-slate-300', false FROM core.component WHERE key = 'button'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'outline', 'Outline', 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50', false FROM core.component WHERE key = 'button'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'ghost', 'Ghost', 'text-indigo-600 hover:bg-indigo-50', false FROM core.component WHERE key = 'button'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'danger', 'Danger', 'bg-red-600 text-white hover:bg-red-700', false FROM core.component WHERE key = 'button'
ON CONFLICT (component_id, variant_key) DO NOTHING;

-- 2. Header
INSERT INTO core.component (key, display_name, description, status)
VALUES ('header', 'Header', 'Core header/navigation bar component.', 'finalized')
ON CONFLICT (key) DO UPDATE SET display_name = EXCLUDED.display_name, status = 'finalized';

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'standard', 'Standard Light', 'bg-white border-b border-slate-200 text-slate-900', true FROM core.component WHERE key = 'header'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'minimal', 'Minimal', 'bg-transparent border-b border-slate-100 text-slate-800', false FROM core.component WHERE key = 'header'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'dark', 'Dark', 'bg-slate-900 border-b border-slate-800 text-white', false FROM core.component WHERE key = 'header'
ON CONFLICT (component_id, variant_key) DO NOTHING;

-- 3. Sidebar
INSERT INTO core.component (key, display_name, description, status)
VALUES ('sidebar', 'Sidebar', 'Core sidebar navigation menu component.', 'finalized')
ON CONFLICT (key) DO UPDATE SET display_name = EXCLUDED.display_name, status = 'finalized';

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'fixed', 'Fixed Light', 'w-64 bg-slate-50 border-r border-slate-200 text-slate-800', true FROM core.component WHERE key = 'sidebar'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'collapsible', 'Minimal/Compact', 'w-20 hover:w-64 transition-all bg-white border-r border-slate-200 text-slate-700', false FROM core.component WHERE key = 'sidebar'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'dark', 'Dark Sidebar', 'w-64 bg-slate-900 border-r border-slate-800 text-slate-200', false FROM core.component WHERE key = 'sidebar'
ON CONFLICT (component_id, variant_key) DO NOTHING;

-- 4. Footer
INSERT INTO core.component (key, display_name, description, status)
VALUES ('footer', 'Footer', 'Core footer layout component.', 'finalized')
ON CONFLICT (key) DO UPDATE SET display_name = EXCLUDED.display_name, status = 'finalized';

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'standard', 'Standard Dark', 'bg-slate-900 text-slate-400 py-10 px-8 text-center', true FROM core.component WHERE key = 'footer'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'minimal', 'Minimal Light', 'bg-white border-t border-slate-200 text-slate-500 py-6 px-6 text-center', false FROM core.component WHERE key = 'footer'
ON CONFLICT (component_id, variant_key) DO NOTHING;

INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
SELECT id, 'columns', 'Multi-Column', 'bg-slate-950 text-slate-300 py-12 px-8', false FROM core.component WHERE key = 'footer'
ON CONFLICT (component_id, variant_key) DO NOTHING;
