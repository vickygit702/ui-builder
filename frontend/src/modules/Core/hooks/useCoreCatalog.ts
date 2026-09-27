import { useState, useEffect, useCallback } from "react";
import { api } from "../../utils/api";
import {
  ComponentResponse,
  CreateComponentInput,
} from "../../types/component.types";

export function useCoreCatalog() {
  const [existing, setExisting] = useState<ComponentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<ComponentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchComponents = useCallback(() => {
    setLoading(true);
    api
      .get<ComponentResponse[]>("/core/components")
      .then((data) => {
        setExisting(data);
        setError(null);
      })
      .catch(() => {
        // Backend may not be running yet during setup -- fail quietly
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const saveComponent = useCallback(
    async (
      payload: CreateComponentInput,
    ): Promise<ComponentResponse | undefined> => {
      setSaving(true);
      setError(null);
      try {
        const result = await api.post<ComponentResponse>(
          "/core/components",
          payload,
        );
        setSaved(result);
        setExisting((prev) => [
          ...prev.filter((c) => c.key !== payload.key),
          result,
        ]);
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to save component.";
        setError(message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return {
    existing,
    loading,
    saving,
    saved,
    error,
    saveComponent,
    refetch: fetchComponents,
  };
}
