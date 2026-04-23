# Project Constitution: Ficha Kinésica Integral

## Core Principles
1. **Clinical Professionalism:** The UI must look like a medical tool, not a generic form. Premium aesthetics are mandatory.
2. **Lightweight & Static:** The project must run 100% on GitHub Pages without a backend.
3. **Data Privacy:** Patient data must be handled with care, strictly stored locally in the browser (for now).
4. **Offline First:** The app must be fully functional without an internet connection using PWA technology.

## Coding Standards
1. **Vanilla Stack:** Use HTML5, CSS3, and ES6+ JavaScript. No build steps (Vite/React) unless specifically requested.
2. **Naming Conventions:**
   - HTML IDs: `kebab-case` (e.g., `btn-save`, `fc-val`).
   - CSS Classes: `kebab-case` (e.g., `vital-card`).
   - JS Variables/Functions: `camelCase` (e.g., `saveToLocal`, `currentUser`).
3. **Language:** Code comments and user-facing text must be in **Spanish**.
4. **Documentation:** Every major feature must be documented in the `.spec` folder.

## Workflow
- **Spec-Driven Development:** Every major change starts with a specification in `.spec/specify.md` and a technical plan in `.spec/tech_plan.md`.
- **Version Control:** Descriptive commits in Spanish.
