import { useState } from "react";
import { useWebsiteBuilder } from "./hooks/useWebsiteBuilder";
import { useComponentCatalog } from "./hooks/useComponentCatalog";
import { useProjectPersistence } from "./hooks/useProjectPersistence";
import { useAuth } from "../auth/useAuth";
import BuilderHeader from "./components/BuilderHeader";
import RouteManager from "./components/RouteManager";
import ComponentSidebar from "./components/ComponentSidebar";
import CanvasView from "./components/CanvasView";
import ButtonPropertiesPanel from "./components/ButtonPropertiesPanel";

export default function WebsiteBuilder() {
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const {
    routes,
    projectName,
    activeRoute,
    activePreviewRoute,
    activeRouteId,
    previewMode,
    activePreviewPath,
    viewport,
    selectedButtonRef,
    handleSelectRoute,
    handleAddRoute,
    handleDeleteRoute,
    handleDropButton,
    handleMoveButton,
    handleRemoveButton,
    handleUpdateButton,
    handleSelectButton,
    handleTogglePreview,
    handlePreviewNavigate,
    setViewport,
    handleAddSection,
    handleDeleteSection,
  } = useWebsiteBuilder();

  const {
    components,
    buttonVariants,
    headerVariants,
    sidebarVariants,
    footerVariants,
    loading: catalogLoading,
  } = useComponentCatalog();

  const { user, logout } = useAuth();
  const { saveProjectToDb, downloadProjectZip, saving, saved, exporting } =
    useProjectPersistence();

  // Find selected component details for properties panel
  const selectedSection = selectedButtonRef
    ? activeRoute.sections.find((s) => s.id === selectedButtonRef.sectionId)
    : null;
  const selectedButton =
    selectedSection && selectedButtonRef
      ? (selectedSection.buttons.find(
          (b) => b.id === selectedButtonRef.buttonId,
        ) ?? null)
      : null;

  function handleCloseButtonProperties() {
    handleSelectButton(null, null);
  }

  function handleSave() {
    void saveProjectToDb(projectName, routes);
  }

  function handleExport() {
    void downloadProjectZip();
  }

  const displayedRoute = previewMode ? activePreviewRoute : activeRoute;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden">
      <BuilderHeader
        currentRoutePath={displayedRoute.path}
        previewMode={previewMode}
        viewport={viewport}
        canvasWidth={canvasWidth}
        userEmail={user?.email}
        saving={saving}
        saved={saved}
        exporting={exporting}
        onTogglePreview={handleTogglePreview}
        onSetViewport={setViewport}
        onSaveToDb={handleSave}
        onExportZip={handleExport}
        onLogout={logout}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebars (Only visible in edit mode) */}
        {!previewMode && (
          <>
            <RouteManager
              routes={routes}
              activeRouteId={activeRouteId}
              onSelectRoute={handleSelectRoute}
              onAddRoute={handleAddRoute}
              onDeleteRoute={handleDeleteRoute}
            />
            <ComponentSidebar
              components={components}
              buttonVariants={buttonVariants}
              headerVariants={headerVariants}
              sidebarVariants={sidebarVariants}
              footerVariants={footerVariants}
              loading={catalogLoading}
            />
          </>
        )}

        {/* Center Canvas */}
        <CanvasView
          route={displayedRoute}
          allRoutes={routes}
          previewMode={previewMode}
          activePreviewPath={activePreviewPath}
          viewport={viewport}
          selectedButtonId={selectedButtonRef?.buttonId}
          onDropButton={handleDropButton}
          onMoveButton={handleMoveButton}
          onSelectButton={handleSelectButton}
          onDeleteSection={handleDeleteSection}
          onRemoveButton={handleRemoveButton}
          onAddSection={handleAddSection}
          onPreviewNavigate={handlePreviewNavigate}
          onClosePreview={handleTogglePreview}
          onCanvasWidthChange={setCanvasWidth}
        />

        {/* Right Properties Panel (Edit mode only, when button selected) */}
        {!previewMode && selectedButton && selectedButtonRef && (
          <ButtonPropertiesPanel
            button={selectedButton}
            sectionId={selectedButtonRef.sectionId}
            routes={routes}
            variants={buttonVariants}
            onUpdate={handleUpdateButton}
            onRemove={handleRemoveButton}
            onClose={handleCloseButtonProperties}
          />
        )}
      </div>
    </div>
  );
}
