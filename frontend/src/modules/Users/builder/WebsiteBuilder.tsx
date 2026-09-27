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
import Dialog from "../../Core/dialog/Dialog";
import { CanvasComponentInstance } from "../../types/builder.types";

export default function WebsiteBuilder() {
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [activeDialogButton, setActiveDialogButton] =
    useState<CanvasComponentInstance | null>(null);

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
    dialogVariants,
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

  function handleCloseDialog() {
    setActiveDialogButton(null);
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
              dialogVariants={dialogVariants}
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
          onPreviewNavigate={handlePreviewNavigate}
          onClosePreview={handleTogglePreview}
          onCanvasWidthChange={setCanvasWidth}
          onOpenDialog={setActiveDialogButton}
        />

        {/* Right Properties Panel (Edit mode only, when button selected) */}
        {!previewMode && selectedButton && selectedButtonRef && (
          <ButtonPropertiesPanel
            button={selectedButton}
            sectionId={selectedButtonRef.sectionId}
            routes={routes}
            variants={buttonVariants}
            headerVariants={headerVariants}
            sidebarVariants={sidebarVariants}
            footerVariants={footerVariants}
            onUpdate={handleUpdateButton}
            onRemove={handleRemoveButton}
            onClose={handleCloseButtonProperties}
            onPreviewDialog={setActiveDialogButton}
          />
        )}
      </div>

      {/* Full Page Modal Dialog with Background Blur */}
      {activeDialogButton && (
        <Dialog
          isOpen={true}
          title={activeDialogButton.dialogTitle || "Feature Section Modal"}
          variant={activeDialogButton.dialogSize || "medium"}
          onClose={handleCloseDialog}
          footer={
            <>
              <button
                type="button"
                onClick={handleCloseDialog}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCloseDialog}
                className="px-4 py-1.5 rounded-md text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
              >
                {activeDialogButton.dialogActionLabel || "Confirm"}
              </button>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {activeDialogButton.dialogContent ||
                "This is the dialog content area. It opens full screen with blurred page background. You can dynamically insert feature blocks, details, or forms here."}
            </p>
          </div>
        </Dialog>
      )}
    </div>
  );
}
