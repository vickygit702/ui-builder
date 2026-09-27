# Software Requirements Specification (SRS)
## UI Builder & Prototyping Platform for Frontend Developers

**Version:** 1.0 (Draft)
**Document Type:** Software Requirements Specification
**Prepared for:** Internal Project Planning

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements for a **web-based, no-code/low-code UI Builder Platform**. The platform allows developers to visually design application layouts using a library of pre-built, reusable React components, wire up basic interactivity between components (prototyping), preview the result across device sizes, and export a production-ready, fully structured React project as a downloadable ZIP file.

The purpose of this SRS is to translate the initial concept notes and ideology into a structured specification that can guide architecture decisions, sprint planning, and backend/frontend implementation.

### 1.2 Scope

The system is composed of three primary functional domains:

1. **Core Reusable Component Library** — A first-party (no third-party UI libraries) set of components: buttons, dialogs, headers, footers, navs, carousels, dropdowns, radio buttons, checkboxes, date pickers, cards, tables (with/without pagination and filters), sidebars, etc.
2. **User (Developer) Workspace** — Where a developer builds pages using drag-and-drop, configures component properties, defines routes, links components together into a working prototype, previews the result responsively, and exports the final project.
3. **Admin Workspace** — Where platform administrators manage users, subscriptions, and platform-wide settings.

The product is comparable in spirit to tools like Figma (visual layout) and Ant Design (pre-built component systems), merged into a single application whose end output is real, exportable React source code rather than just a static design file.

### 1.3 Intended Audience

This document is intended for:
- Product owners defining scope and priorities
- Frontend and backend engineers implementing the platform
- QA engineers designing test plans
- Future contributors onboarding onto the project

### 1.4 Definitions and Abbreviations

| Term | Definition |
|---|---|
| SRS | Software Requirements Specification |
| FE | Frontend |
| BE | Backend |
| Canvas | The visual drag-and-drop editing surface |
| Prototype | The set of interaction bindings between components (e.g., button click → dialog open) |
| Component Instance | A configured occurrence of a core component placed on the canvas |
| Export | The process of generating a downloadable, production-ready project from the user's design |

### 1.5 Product Perspective

This is a new, standalone, self-contained product (not an extension of an existing system). It consists of a React-based frontend application and an Express-based backend API, backed by a database that persists component definitions, page layouts, prototype logic, users, and subscriptions.

---

## 2. Overall Description

### 2.1 Problem Statement (Basis for the Product)

Frontend developers frequently face a recurring pain point when starting a new project:
- Backend schema and API design can begin quickly once requirements are known.
- Frontend development, by contrast, typically starts with no clear visual direction. Developers either build low-fidelity mockups in general-purpose design tools (which don't produce usable code) or start coding blind, leading to rework, inconsistent components, and dissatisfaction with the final look and feel.

This platform addresses that gap by letting a developer visually assemble a UI using a trusted, first-party component set, see it working (with real interactivity) before writing a line of application code, and then receive a real, structured, optimized React project as a starting point.

### 2.2 User Classes and Characteristics

| User Class | Description | Key Needs |
|---|---|---|
| **Developer (User)** | A frontend/full-stack developer who wants to rapidly scaffold a UI-consistent React application | Fast layout creation, reliable reusable components, working prototypes, clean exportable code |
| **Admin** | Platform operator/owner | Visibility into users and subscriptions, ability to manage plans and platform settings |

### 2.3 Operating Environment

- **Frontend:** React (JavaScript/TypeScript), Tailwind CSS, React Router, optional Redux for state management. No third-party component libraries — all UI primitives are built in-house.
- **Backend:** Node.js with Express.
- **Database:** Relational or document store capable of persisting structured layout trees, component configuration objects, and serialized prototype logic (exact engine to be selected during architecture phase — see Section 6).
- **Client Support:** Modern evergreen browsers (Chrome, Edge, Firefox, Safari), responsive down to mobile viewport widths.

### 2.4 Design and Implementation Constraints

- No third-party component libraries (e.g., no Ant Design, MUI, Chakra) — all core components must be built from scratch and owned by the platform.
- Icons are sourced from `lucide-react`.
- Styling is Tailwind-only; no CSS-in-JS libraries.
- Routing uses React Router both in the builder's own admin/user shell and in the exported generated projects.
- The exported project must be a standalone, runnable React application with no runtime dependency on the platform itself.

### 2.5 Assumptions and Dependencies

- Users have basic familiarity with web application structure (pages, routes, components) even if they are not deeply experienced with React internals.
- The initial release targets desktop, laptop, and mobile *preview* breakpoints; the builder's own authoring UI is assumed to be primarily used on desktop/laptop screens.
- Redux support in generated projects is optional and only scaffolded if the user opts in.

---

## 3. System Features (Functional Requirements)

Each feature below is written as a set of numbered functional requirements (FR) suitable for direct conversion into backlog tickets.

### 3.1 Core Reusable Component Library

**Description:** A first-party library of foundational UI components, each with configurable variants, used both inside the builder canvas and as the source of truth for exported code.

- **FR-1.1:** The system shall provide a base set of components including: Button, Dialog (header/body/footer), Header, Footer, Navigation/Nav Items, Carousel, Dropdown, Radio Button, Checkbox, Date Picker, Card, Table (with optional pagination and filtering), Sidebar (with nav support).
- **FR-1.2:** Each component shall support multiple configurable **variants** (e.g., Button: primary, secondary, outline, ghost, danger).
- **FR-1.3:** Each component definition shall be stored in the database as structured metadata: component type, available props/variants, default styles (Tailwind class mappings), and default markup/behavior template.
- **FR-1.4:** Component definitions shall be versioned, so that updates to a core component do not silently break already-built user projects without an explicit migration step.
- **FR-1.5:** New components shall be addable to the library without requiring changes to the core builder engine (i.e., components are data-driven, not hardcoded into the canvas renderer).

### 3.2 Layout Canvas (Drag-and-Drop Builder)

- **FR-2.1:** Upon entering a project, the user shall be presented with a blank canvas and a device-mode selector (Desktop, Laptop, Mobile).
- **FR-2.2:** The user shall be able to drag components from a component panel onto the canvas.
- **FR-2.3:** The user shall be able to reposition, nest, and delete component instances on the canvas.
- **FR-2.4:** The canvas shall reflect real-time visual updates as components are added, moved, or configured.
- **FR-2.5:** The canvas layout shall be persisted as a structured tree (parent/child component relationships) rather than raw HTML, to allow later code generation and editing.

### 3.3 Navigation Panel (Page Management)

- **FR-3.1:** The system shall provide a left-side panel listing all pages within the current project.
- **FR-3.2:** The user shall be able to create, rename, duplicate, and delete pages.
- **FR-3.3:** Selecting a page in the panel shall load its layout into the canvas.

### 3.4 Component Settings (Property Editor)

- **FR-4.1:** Selecting a component instance on the canvas shall open a settings panel showing its configurable properties (variant, text, size, color, spacing, visibility, etc.).
- **FR-4.2:** Property changes shall apply immediately to the canvas preview.
- **FR-4.3:** Property configurations shall be saved per component instance, independent of the base component definition.

### 3.5 Routing

- **FR-5.1:** When a page is created, the user shall be able to assign a route name (URL path).
- **FR-5.2:** The system shall validate route names for uniqueness within the project and for URL-safe formatting.
- **FR-5.3:** Route definitions shall be persisted and used both for in-builder preview navigation and for generating React Router configuration in the exported project.

### 3.6 Prototype Mode (Interaction Binding)

- **FR-6.1:** The user shall be able to define interaction bindings between component instances (e.g., "on click of Button X, open Dialog Y").
- **FR-6.2:** Supported trigger types shall include, at minimum: click, hover, and form submit.
- **FR-6.3:** Supported action types shall include, at minimum: open/close dialog, navigate to route, show/hide element, toggle state.
- **FR-6.4:** Prototype bindings shall be stored as structured logic (e.g., trigger–condition–action tuples) rather than free-form code, so they can be reliably translated into generated component code.

### 3.7 Preview Mode

- **FR-7.1:** The user shall be able to enter a Preview Mode that renders the current project as an interactive prototype, honoring routing and prototype bindings.
- **FR-7.2:** Preview Mode shall support switching between Desktop, Laptop, and Mobile viewport simulations.

### 3.8 Project Export

- **FR-8.1:** The user shall be able to trigger an export that packages the full project as a downloadable ZIP file.
- **FR-8.2:** The exported project shall include: complete folder structure, all generated component code, routing configuration, `package.json` with correct dependencies, and a README with setup instructions.
- **FR-8.3:** The generated code shall follow the platform's standard modular repo structure (see Section 6) so exported projects are immediately familiar and maintainable.
- **FR-8.4:** The exported project shall run standalone via standard `npm install` / `npm run dev` commands, without any dependency on the builder platform itself.
- **FR-8.5:** If the user opted into Redux during setup, the export shall include a scaffolded store, slice structure, and provider wiring.

### 3.9 Responsiveness

- **FR-9.1:** All builder-authored layouts shall support responsive behavior across the three target breakpoints (desktop, laptop, mobile), with per-breakpoint property overrides where applicable.
- **FR-9.2:** Generated Tailwind classes in exported code shall include responsive variants consistent with the breakpoints configured in the builder.

### 3.10 Admin Module

- **FR-10.1:** The Admin Dashboard shall display a list of registered users and their current subscription status/tier.
- **FR-10.2:** Admins shall be able to view, edit, suspend, or delete user accounts.
- **FR-10.3:** Admins shall be able to configure subscription plans (tiers, limits, pricing metadata).
- **FR-10.4:** Admin actions shall be restricted by role-based access control, separate from standard user authentication.

### 3.11 Authentication & Authorization

- **FR-11.1:** The system shall support separate authentication flows for Admin and standard Users, per the existing module structure (`Admin/Auth`, `Users/Auth`).
- **FR-11.2:** Access to Admin routes/APIs shall be denied to non-admin authenticated users.
- **FR-11.3:** Subscription tier shall gate access to certain platform features (e.g., component limits, export limits), enforced at the API layer, not only in the UI.

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Canvas interactions (drag, drop, property edit) should reflect visually within ~100ms to preserve a "live editing" feel. |
| **Scalability** | The backend should support concurrent multi-user editing sessions without layout data corruption (e.g., via per-project locking or granular save operations). |
| **Data Integrity** | Layout trees, component configurations, and prototype logic must be validated on save to prevent malformed exports. |
| **Security** | All API endpoints must enforce authentication; admin endpoints must enforce role checks; user-submitted component configuration must be sanitized before being used in code generation to prevent injection into generated project files. |
| **Reliability** | Export generation must be idempotent and resumable/retryable in case of failure mid-export. |
| **Maintainability** | Core component definitions must be data-driven (see FR-1.5) so the component catalog can grow without core engine changes. |
| **Usability** | The builder should require minimal onboarding for a developer already familiar with standard web/app builder conventions (drag-drop, property panels). |
| **Portability** | Exported projects must run on any standard Node.js environment without platform lock-in. |

---

## 5. External Interface Requirements

### 5.1 User Interfaces
- Layout Canvas, Navigation Panel, Component Settings Panel, Routing configuration screen, Preview Mode, Export screen (User view).
- Admin Dashboard (user list, subscription management, settings) (Admin view).

### 5.2 API Interfaces
- REST (or equivalent) API exposed by the Express backend for: authentication, project CRUD, page CRUD, component instance CRUD, prototype binding CRUD, export job initiation/status, admin user/subscription management.

### 5.3 Software Interfaces
- Frontend consumes backend APIs over HTTPS.
- Export service produces a ZIP artifact, either streamed directly or made available via a temporary download link.

---

## 6. Proposed System Architecture (Repo Structure Reference)

The platform itself (not the *exported* projects) follows a modular structure separating **Core** (shared/reusable), **Admin**, and **Users** concerns on both frontend and backend — mirroring the same philosophy the platform teaches its end users.

**Backend (BE):**
```
BE
├── modules
│   ├── core (button, dialog, etc.)
│   ├── Admin (Auth, subscription-config, users)
│   └── users (Auth, prototype, components)
├── shared (utils, types)
├── middleware
├── routing / api
├── app.ts
├── server.ts
└── db (migration, schema.ts)
```

**Frontend (FE):**
```
FE/src
└── modules
    ├── Core (button, dialog, etc.)
    ├── Admin (Auth, Subscription-config, Users)
    ├── Users (Auth, Prototype, components)
    ├── utils (shared)
    ├── types
    └── routings
```

This same modular philosophy — core/admin/users separation — is recommended as the template pattern for the **exported user projects** as well, so that developers receive output that is structurally consistent with modern maintainable React applications.

---

## 7. Data Model Considerations

Because the platform must persist not just data but **UI structure, styling, and behavioral logic**, the data model needs to represent at least the following entities:

| Entity | Key Attributes |
|---|---|
| **Project** | id, owner (user), name, created/updated timestamps, Redux opt-in flag |
| **Page** | id, project_id, name, route path |
| **ComponentDefinition** | id, type, version, available variants/props, default template |
| **ComponentInstance** | id, page_id, component_definition_id, parent_instance_id (for nesting), configured props/styles, position/order |
| **PrototypeBinding** | id, source_instance_id, trigger_type, target_instance_id or route, action_type |
| **ExportJob** | id, project_id, status, generated_artifact_url, timestamps |
| **User** | id, role (admin/user), auth credentials, subscription_id |
| **Subscription** | id, tier, limits (e.g., max projects, max exports), pricing metadata |

**Key design decision to validate during architecture phase:** whether component instance trees and prototype bindings are stored as normalized relational rows (better for querying/reporting) or as serialized JSON documents per page (simpler to version and reconstruct for code generation). A hybrid approach — normalized metadata with a JSON "layout snapshot" per page — is a common pattern for this class of builder tool and is recommended for further evaluation.

---

## 8. Representative Use Cases

### UC-1: Build and Export a Two-Page App
1. Developer creates a new project.
2. Developer creates "Home" and "About" pages, assigns routes `/` and `/about`.
3. Developer drags a Header, Card grid, and Footer onto the Home canvas; configures each.
4. Developer adds a "Contact" Button on Home bound (via Prototype Mode) to open a Dialog.
5. Developer switches to Mobile preview to confirm responsive behavior.
6. Developer clicks Export; receives a ZIP containing a runnable React project.

### UC-2: Admin Manages a Subscription
1. Admin logs into the Admin Dashboard.
2. Admin views the list of users and current tiers.
3. Admin upgrades a user's subscription tier.
4. The user's platform limits (e.g., export count) update accordingly.

---

## 9. Future Enhancements (Out of Initial Scope)

- Real-time multi-user collaborative editing.
- Component marketplace / community-contributed components.
- Version history and rollback for projects.
- AI-assisted layout suggestions built on top of the structured component/prototype data (distinct from the "blind AI code generation" problem this platform is designed to solve).

---

## 10. Open Questions for Architecture Phase

- Exact database engine choice (relational vs. document-oriented vs. hybrid) for layout/prototype storage.
- Whether code generation happens synchronously on export request or via an async job queue (recommended for larger projects).
- Conflict resolution strategy if concurrent editing is supported in a later phase.
- Licensing/ownership terms for exported code (should be clarified for the product's terms of service, though outside pure technical scope).

---

## 11. Initial Implementation Setup (Getting Started)

This section gives the concrete first steps to stand up a solid FE/BE foundation before any builder-specific feature work begins.

### 11.1 Backend Setup Steps

1. Initialize a Node.js + TypeScript + Express project.
2. Create the module skeleton exactly as specified in Section 6 (`modules/core`, `modules/Admin`, `modules/users`, `shared`, `middleware`, `routing`, `db`).
3. Set up the database connection and a migration tool (e.g., Prisma, Knex, or TypeORM) and create an initial `schema.ts` with placeholder tables: `users`, `projects`, `pages`, `component_definitions`, `component_instances`, `prototype_bindings`.
4. Build `app.ts` (Express app + middleware registration) and `server.ts` (server bootstrap) separately, so the app is testable without a live server.
5. Add core middleware: request logging, centralized error handler, JSON body parsing, CORS config.
6. Stub authentication middleware for both `Admin/Auth` and `Users/Auth` (even a temporary hardcoded check is fine at this stage — real auth logic comes next).
7. Add one health-check route (`GET /api/health`) to confirm the server boots and responds correctly.

### 11.2 Frontend Setup Steps

1. Initialize a React + TypeScript project (Vite is a lighter, faster choice than CRA for this kind of app).
2. Install and configure Tailwind CSS.
3. Install `react-router-dom` and set up a base router shell with placeholder routes.
4. Install `lucide-react` for icons.
5. Create the module skeleton per Section 6 (`Core`, `Admin`, `Users`, `utils`, `types`, `routings`).
6. Build the **first 2–3 core components only** (e.g., Button and Card) as the seed of the internal component library — do not try to build all components before wiring up the rest of the app.
7. Build a placeholder "blank canvas" page and a placeholder component panel, just enough to confirm the app shell renders and routes correctly.
8. Connect the frontend to the backend health-check route to confirm the full stack is wired end-to-end.

### 11.3 Suggested Build Order

Rather than building every core component first, build in this order so you get a working (if minimal) end-to-end loop as early as possible:

1. Backend skeleton + DB + one real table (`projects`) with CRUD.
2. Frontend skeleton + auth stub + "Create Project" screen calling that CRUD API.
3. One component (Button) fully wired: defined in the internal library, listed in the component panel, draggable onto canvas, saved as a `component_instance`.
4. Property editing for that one component.
5. Only then, scale outward: add more components, then routing, then prototype bindings, then export.

This order proves the core architecture (library → DB config → canvas render → save) with the smallest possible surface area before investing in the full component catalog.

---

## 12. Component Storage Strategy: NPM Registry vs. Database

A key open question was **where the actual component code should live**, and whether the public npm registry is a viable option.

### 12.1 Is the npm registry free?

Yes — publishing and installing **public** packages on the public npm registry is free, with no limit relevant to this use case. Private packages (code hidden from the public) require either npm's paid private-package plans, an alternative like GitHub Packages (free tier available, with limits), or a self-hosted private registry (e.g., Verdaccio), which is free software but has its own hosting cost.

### 12.2 Why npm-as-source-of-truth is not the right fit here

Publishing your component library as an npm package and having both the builder and exported projects depend on it sounds appealing, but it creates problems specific to this product:

- **Ongoing runtime dependency:** Every exported project would depend on your package forever. A later change or removal on your end could break projects that already shipped to production — directly conflicting with FR-8.4 ("exported project shall run standalone... without any dependency on the builder platform").
- **Versioning overhead:** Every component tweak requires a full publish cycle before it's usable, slowing iteration during early development.
- **Ownership expectation mismatch:** Developers using a "generate my own project" tool generally expect to **own the exported source code outright**, not point at your registry package forever.
- **Public exposure:** Publishing publicly (the free option) makes your component source visible to anyone, including competitors, unless you pay for private hosting.

### 12.3 Recommended approach: Internal Library + Database Metadata (Hybrid)

Keep these two things clearly separate:

| What | Where it lives | Why |
|---|---|---|
| **Actual component source code** (the real `.tsx` files, styles, variant logic) | Inside your **own platform codebase**, as an internal, unpublished component library (e.g., a workspace package in a monorepo) | Never leaves your control, no publish cycle needed, fully owned |
| **Component catalog metadata** (which components exist, their variant options, prop schema, version number) | **Database** (`component_definitions` table) | Lets the builder UI know what's available and how it can be configured, without duplicating source code per project |
| **Per-project configuration** (which component, which props, position, page) | **Database** (`component_instances` table) | This is genuinely user data — it must be saved per project |

**How this works in practice:**

- The platform's own frontend bundles the internal component library normally at build time (regular imports — no dynamic loading needed for canvas rendering). The canvas maps a `component_definitions.type` string (e.g. `"button"`) to the actual imported React component, then renders it with whatever props are stored in the matching `component_instances` row.
- At **export time**, the backend does **not** generate component code from scratch. It copies the real, already-tested source files for only the components actually used in that project from the internal library into the generated project folder, then generates the page-level JSX/TSX files that assemble those components using each instance's saved configuration.
- This means the database never stores raw executable component source code — only structured configuration — which is safer, smaller, and easier to validate (ties back to the Non-Functional "Security" requirement on sanitizing user-submitted config in Section 4).

This hybrid approach gives you: no npm publishing at all (free or otherwise), full ownership of the exported code, a clean separation between "what components exist" (metadata) and "how a specific page uses them" (instance data), and a straightforward path to add new components later — just add the source file to the internal library and a matching row in `component_definitions`.

---

## 13. Flow Diagrams (Text-Based)

### 13.1 End-to-End Build → Export Flow

```
[Developer Logs In]
        |
        v
[Create Project] ---> [Create Page] ---> [Assign Route Name]
        |
        v
[Drag Component from Panel onto Canvas]
        |
        v
[New component_instance row saved to DB]
        |
        v
[Canvas Re-renders: definition.type mapped to real
 internal component + instance's saved props]
        |
        v
[Select Instance] ---> [Edit Properties in Settings Panel] ---> [Instance row updated in DB]
        |
        v
[Enter Prototype Mode]
        |
        v
[Pick Trigger on Instance A] ---> [Pick Action] ---> [Pick Target: Instance B / Route]
        |
        v
[prototype_binding row saved to DB]
        |
        v
[Enter Preview Mode]
        |
        v
[Pages + Routes + Bindings render as a working interactive prototype]
        |
        v
[Click "Export"]
        |
        v
[Backend collects all component_instances used across all pages of the project]
        |
        v
[For each unique component type used --> copy its real source file
 from the Internal Component Library into the export folder]
        |
        v
[Generate page-level JSX files, wiring instance props + prototype bindings into code]
        |
        v
[Generate routing config, package.json, README, folder structure]
        |
        v
[Zip everything] ---> [Return download link to Developer]
```

### 13.2 Component Definition vs. Instance Relationship

```
Internal Component Library
(real source code, lives in platform's own codebase)
        |
        | referenced by a "type" key, e.g. "button", "card"
        v
component_definitions  (DB table: metadata only)
  - type
  - available variants
  - prop schema
  - version
        |
        | one definition --> many instances
        v
component_instances  (DB table: per-project data)
  - page_id
  - component_definition_id
  - configured props (variant, text, color, size...)
  - position / parent (for nesting)
        |
        | read together at render time
        v
Canvas / Preview
  - looks up definition.type --> real React component
  - passes instance's configured props into it
  - draws it on screen
```

### 13.3 Admin Flow

```
[Admin Logs In] ---> [Admin Dashboard]
        |
        v
[View User List] ---> [Select a User] ---> [Edit / Suspend / Delete]
        |
        v
[View Subscription Plans] ---> [Edit Tier Limits / Pricing]
        |
        v
[Changes saved] ---> [User's effective limits update immediately
                       (e.g., export quota, project count)]
```

---

*End of Document*
