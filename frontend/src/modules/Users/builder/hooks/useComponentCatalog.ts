import { useState, useEffect, useCallback } from "react";
import { api } from "../../../utils/api";
import { ComponentResponse } from "../../../types/component.types";
import {
  BUTTON_VARIANTS,
  ButtonVariantDef,
} from "../../../Core/button/button.variants";
import {
  HEADER_VARIANTS,
  HeaderVariantDef,
} from "../../../Core/header/header.variants";
import {
  SIDEBAR_VARIANTS,
  SidebarVariantDef,
} from "../../../Core/sidebar/sidebar.variants";
import {
  FOOTER_VARIANTS,
  FooterVariantDef,
} from "../../../Core/footer/footer.variants";
import {
  DIALOG_VARIANTS,
  DialogVariantDef,
} from "../../../Core/dialog/dialog.variants";

interface UseComponentCatalogResult {
  components: ComponentResponse[];
  buttonVariants: ButtonVariantDef[];
  headerVariants: HeaderVariantDef[];
  sidebarVariants: SidebarVariantDef[];
  footerVariants: FooterVariantDef[];
  dialogVariants: DialogVariantDef[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useComponentCatalog(): UseComponentCatalogResult {
  const [components, setComponents] = useState<ComponentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ComponentResponse[]>("/core/components");
      setComponents(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch components";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCatalog();
  }, [fetchCatalog]);

  const buttonComp = components.find((c) => c.key === "button");
  const buttonVariants: ButtonVariantDef[] =
    buttonComp && buttonComp.variants.length > 0
      ? buttonComp.variants.map((v) => ({
          key: v.variantKey,
          label: v.label,
          classNames: v.classNames,
          isDefault: v.isDefault,
        }))
      : BUTTON_VARIANTS;

  const headerComp = components.find((c) => c.key === "header");
  const headerVariants: HeaderVariantDef[] =
    headerComp && headerComp.variants.length > 0
      ? headerComp.variants.map((v) => ({
          key: v.variantKey,
          label: v.label,
          classNames: v.classNames,
          isDefault: v.isDefault,
        }))
      : HEADER_VARIANTS;

  const sidebarComp = components.find((c) => c.key === "sidebar");
  const sidebarVariants: SidebarVariantDef[] =
    sidebarComp && sidebarComp.variants.length > 0
      ? sidebarComp.variants.map((v) => ({
          key: v.variantKey,
          label: v.label,
          classNames: v.classNames,
          isDefault: v.isDefault,
        }))
      : SIDEBAR_VARIANTS;

  const footerComp = components.find((c) => c.key === "footer");
  const footerVariants: FooterVariantDef[] =
    footerComp && footerComp.variants.length > 0
      ? footerComp.variants.map((v) => ({
          key: v.variantKey,
          label: v.label,
          classNames: v.classNames,
          isDefault: v.isDefault,
        }))
      : FOOTER_VARIANTS;

  const dialogComp = components.find((c) => c.key === "dialog");
  const dialogVariants: DialogVariantDef[] =
    dialogComp && dialogComp.variants.length > 0
      ? dialogComp.variants.map((v) => ({
          key: v.variantKey,
          label: v.label,
          classNames: v.classNames,
          isDefault: v.isDefault,
        }))
      : DIALOG_VARIANTS;

  return {
    components,
    buttonVariants,
    headerVariants,
    sidebarVariants,
    footerVariants,
    dialogVariants,
    loading,
    error,
    refetch: fetchCatalog,
  };
}
