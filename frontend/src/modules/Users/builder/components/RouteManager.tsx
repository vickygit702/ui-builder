import { useState, ChangeEvent, FormEvent, MouseEvent } from "react";
import {
  Plus,
  Trash2,
  Globe,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { UserRoute } from "../../../types/builder.types";

interface RouteManagerProps {
  routes: UserRoute[];
  activeRouteId: string;
  onSelectRoute: (routeId: string) => void;
  onAddRoute: (name: string, path: string) => void;
  onDeleteRoute: (routeId: string) => void;
}

export default function RouteManager({
  routes,
  activeRouteId,
  onSelectRoute,
  onAddRoute,
  onDeleteRoute,
}: RouteManagerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routePath, setRoutePath] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleToggleCollapse() {
    setIsCollapsed((prev) => !prev);
  }

  function handleOpenAddForm() {
    setIsAdding(true);
    setRouteName("");
    setRoutePath("");
    setError(null);
  }

  function handleCloseAddForm() {
    setIsAdding(false);
    setError(null);
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setRouteName(val);
    if (
      !routePath ||
      routePath === `/${routeName.toLowerCase().replace(/\s+/g, "-")}`
    ) {
      setRoutePath(`/${val.toLowerCase().trim().replace(/\s+/g, "-")}`);
    }
  }

  function handlePathChange(e: ChangeEvent<HTMLInputElement>) {
    setRoutePath(e.target.value);
  }

  function handleSubmitAdd(e: FormEvent) {
    e.preventDefault();
    const trimmedName = routeName.trim();
    let trimmedPath = routePath.trim();

    if (!trimmedName) {
      setError("Route name is required");
      return;
    }
    if (!trimmedPath) {
      setError("Route path is required");
      return;
    }
    if (!trimmedPath.startsWith("/")) {
      trimmedPath = `/${trimmedPath}`;
    }

    const exists = routes.some((r) => r.path === trimmedPath);
    if (exists) {
      setError(`Route path "${trimmedPath}" already exists`);
      return;
    }

    onAddRoute(trimmedName, trimmedPath);
    setIsAdding(false);
    setRouteName("");
    setRoutePath("");
    setError(null);
  }

  function handleDeleteClick(e: MouseEvent, routeId: string) {
    e.stopPropagation();
    onDeleteRoute(routeId);
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-3 select-none shrink-0 transition-all">
        <button
          type="button"
          onClick={handleToggleCollapse}
          title="Expand User Routes"
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleToggleCollapse}
          title="Expand User Routes"
          className="mt-4 flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className="p-1.5 rounded bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
            <Globe className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-500 group-hover:text-indigo-600 [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest mt-2">
            Routes ({routes.length})
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 select-none transition-all">
      <div className="p-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          User Routes
          <span className="text-[10px] font-normal text-slate-400">
            ({routes.length})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleOpenAddForm}
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            title="Add New Route"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            title="Collapse User Routes"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmitAdd}
          className="p-3 bg-white border-b border-indigo-100 shadow-sm"
        >
          <h4 className="text-xs font-semibold text-slate-800 mb-2">
            Create New Route
          </h4>
          <div className="space-y-2 mb-2">
            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">
                Page Name
              </label>
              <input
                type="text"
                value={routeName}
                onChange={handleNameChange}
                placeholder="e.g. Pricing"
                className="w-full text-xs px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">
                URL Path
              </label>
              <input
                type="text"
                value={routePath}
                onChange={handlePathChange}
                placeholder="/pricing"
                className="w-full text-xs px-2 py-1 font-mono border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          {error && <p className="text-[11px] text-red-600 mb-2">{error}</p>}
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={handleCloseAddForm}
              className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 text-xs bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700"
            >
              Save Route
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {routes.map((route) => {
          const isActive = route.id === activeRouteId;
          const isHome = route.path === "/";

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`group flex items-center justify-between px-2.5 py-2 rounded-md text-xs cursor-pointer transition-colors ${
                isActive
                  ? "bg-white text-indigo-700 font-medium shadow-sm border border-slate-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Layers
                  className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                />
                <div className="truncate">
                  <span className="block truncate font-medium">
                    {route.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono">
                    {route.path}
                  </span>
                </div>
              </div>

              {!isHome && (
                <button
                  type="button"
                  title={`Delete ${route.name}`}
                  onClick={(e) => handleDeleteClick(e, route.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
