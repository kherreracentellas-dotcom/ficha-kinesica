# Technical Plan: Ficha Kinésica Integral

## Architecture
- **Frontend:** Monolithic HTML/CSS/JS architecture.
- **Persistence:** Browser `LocalStorage` using user-specific keys (`kine_form_{username}`).
- **Authentication:** Mock authentication layer in `script.js` with local validation.
- **PDF Generation:** Client-side rendering using `html2pdf.js` (Canvas/jsPDF).
- **Service Worker:** Custom caching strategy (Cache First) for offline support.

## Tech Stack
- **HTML5:** Semantic structure.
- **CSS3:** Flexbox/Grid for responsiveness, Custom Properties for theming.
- **JavaScript:** ES6 modules/functional approach.
- **Libraries:** 
  - `html2pdf.js` (PDF Export)
  - Google Fonts (Inter, Outfit)

## Security
- Data is never sent to a server.
- Basic password simulation for local access control.
