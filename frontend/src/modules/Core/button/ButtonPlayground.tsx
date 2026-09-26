import { useEffect, useState } from 'react';
import { Check, Loader2, Save } from 'lucide-react';
import Button from './Button';
import { BUTTON_VARIANTS } from './button.variants';
import { api } from '../../utils/api';
import { ComponentResponse, CreateComponentInput } from '../../types/component.types';

// Displays every button variant, and only calls the backend when the user
// explicitly finalizes -- draft experimentation stays entirely client-side.
export default function ButtonPlayground() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<ComponentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] = useState<ComponentResponse[]>([]);

  useEffect(() => {
    api
      .get<ComponentResponse[]>('/core/components')
      .then(setExisting)
      .catch(() => {
        // Backend may not be running yet during early setup -- fail quietly here.
      });
  }, []);

  async function handleFinalize() {
    setSaving(true);
    setError(null);

    const payload: CreateComponentInput = {
      key: 'button',
      displayName: 'Button',
      description: 'Core reusable button component with style variants.',
      variants: BUTTON_VARIANTS.map((v) => ({
        variantKey: v.key,
        label: v.label,
        classNames: v.classNames,
        isDefault: v.isDefault ?? false,
      })),
    };

    try {
      const result = await api.post<ComponentResponse>('/core/components', payload);
      setSaved(result);
      setExisting((prev) => [...prev.filter((c) => c.key !== 'button'), result]);
    } catch (err: any) {
      setError(err.message || 'Failed to save component.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Core Module — Button</h1>
        <p className="text-slate-600 mb-8">
          Preview every variant below. Nothing is saved until you finalize it — the backend only
          stores components you explicitly confirm.
        </p>

        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Variants (working draft)
          </h2>
          <div className="flex flex-wrap gap-3">
            {BUTTON_VARIANTS.map((v) => (
              <div key={v.key} className="flex flex-col items-center gap-2">
                <Button variant={v.key}>{v.label}</Button>
                <span className="text-xs text-slate-400">{v.key}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleFinalize}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Finalize &amp; Save to Backend
        </button>

        {saved && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-600">
            <Check className="w-4 h-4" /> Saved as "{saved.displayName}" (v{saved.version}, {saved.variants.length} variants)
          </p>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {existing.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
              Finalized components currently in the database
            </h2>
            <ul className="space-y-2">
              {existing.map((c) => (
                <li key={c.id} className="bg-white border border-slate-200 rounded-lg p-4 text-sm">
                  <span className="font-medium text-slate-900">{c.displayName}</span>{' '}
                  <span className="text-slate-400">
                    ({c.key}, v{c.version})
                  </span>{' '}
                  — {c.variants.length} variants
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
