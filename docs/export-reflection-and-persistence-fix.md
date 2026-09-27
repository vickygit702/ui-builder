# Export Reflection and Multi-Page Persistence Fix

## What was done

- **Atomic Export with Current State**: Updated `exportProjectZip` to pass current in-memory project layout directly to the backend export endpoint so clicking "Export ZIP" immediately exports what is built on screen without requiring an explicit manual DB save first.
- **Backend Payload Export & Save**: Updated `exportProject` and `exportUserProject` to accept `projectData`, automatically saving the user's project to PostgreSQL and generating the production ZIP.
- **Inter-Page Navigation in Exported Project**:
  - Enhanced Header in exported React app to automatically render navigation links for all pages in the project.
  - Enhanced Sidebar in exported React app to render `<NavLink>` items for all pages with active page highlighting.
  - Enhanced empty page fallback on exported site to display helpful navigation buttons to any other pages created in the builder.
- **Strictly Conditional Header, Sidebar, and Footer Rendering**:
  - Removed default fallback `<Header>` and `<Footer>` in `exportGenerator.ts`. Header, Sidebar, and Footer now ONLY render in the exported site if the user explicitly placed them on that page in the builder.
  - Page components now dynamically import only the components and hooks (`Header`, `Sidebar`, `Footer`, `Button`, `Dialog`, `useNavigate`, `useState`, `Link`, `NavLink`) that are actually utilized.
- **Make Root / Page Switcher in Builder**:
  - Added `handleSetHomeRoute` in `useWebsiteBuilder` and a "Make /" action in `RouteManager` allowing users to set any page (e.g. `/page-1`) as the root home page (`/`) with one click.
- **Project Persistence on Mount**:
  - Connected `loadProjectFromDb` in `WebsiteBuilder.tsx` on mount, ensuring previously saved websites, custom routes, and component placements are restored after refresh.

## Where it lives

- Backend:
  - `backend/src/modules/users/project/exportGenerator.ts`
  - `backend/src/modules/users/project/project.controller.ts`
  - `backend/src/modules/users/project/project.service.ts`
- Frontend:
  - `frontend/src/modules/Users/builder/WebsiteBuilder.tsx`
  - `frontend/src/modules/Users/builder/hooks/useProjectPersistence.ts`
  - `frontend/src/modules/Users/builder/hooks/useWebsiteBuilder.ts`
  - `frontend/src/modules/Users/builder/components/RouteManager.tsx`

## Notes / follow-ups

- Database schema remained unchanged (tables `users.project`, `users.page`, `users.component_instance`, `users.project_export` were already present).
