# Context File for AI Assistants

> **Instructions for the AI:** If you are reading this file, you have been provided with the complete architectural context of this Power Platform Developer Portfolio. Please use the following details to understand the stack, design philosophy, and data flow before modifying any code.

## 1. Project Overview
This project is a highly scalable, premium-tier developer portfolio built for **Youhanna Maher Abadir**, a Power Platform Developer. 
The core philosophy is a **"Content-First Architecture"** which strictly decouples the user interface from the data. 

### Core Tech Stack
- **Native HTML5**: Semantic markup, no frameworks (no React, Vue, or Next.js required).
- **Vanilla CSS3**: Utilizes a robust CSS Variable system (`:root`) to handle Light/Dark mode and global theming. 
- **Vanilla JavaScript (ES6)**: Handles dynamic DOM injection by fetching `.json` files. No build tools or bundlers (Webpack, Vite) are strictly required for the frontend.
- **Formspree AJAX API**: Integrated for the contact form.
- **FontAwesome 6.4.0 (CDN)**: Handles all standard icons.
- **Icons8 & SVG Masks**: Used for custom/brand icons that aren't available in standard FontAwesome.

## 2. Directory Structure & Data Flow

```text
/
├── index.html            (The single-page shell)
├── /css/
│   └── style.css         (All styling, fully responsive, variables-based)
├── /js/
│   └── script.js         (Fetches JSON data, handles modals, theme toggles, and Formspree AJAX)
├── /data/                (The Database)
│   ├── profile.json      (Hero text, About, Skills, Contact Info)
│   ├── experience.json   (Resume/Timeline data)
│   ├── education.json    (Degrees and Certifications text data)
│   ├── projects.json     (Case Studies, images, and video links)
│   └── certificates.json (Microsoft certifications and verifiable links)
└── /portfolio/           (Media Storage)
    ├── /images/          (Profile photo: profile.jpg)
    ├── /files/           (Downloadable CV: CV_Youhanna_Maher.pdf)
    ├── /projects/        (Project specific folders containing thumbnails and /images/ galleries)
    └── /certificates/    (Certificate image assets)
```

### How the Data Flow Works
1. `index.html` loads empty container `<div>` elements with specific IDs (e.g., `<div id="projects-grid">`).
2. At the bottom of `index.html`, `script.js` is executed.
3. The `initApp()` in `script.js` fires off multiple asynchronous `fetch()` calls to load the `.json` files from the `/data/` folder.
4. Using template literals, `script.js` injects the parsed JSON into the DOM.
*Note: Because of native CORS policies, this architecture requires a local development server (e.g., VS Code "Live Server") to function locally.*

## 3. Notable Architectural Decisions

### Theme Toggle (Dark & Light Mode)
- **Implementation**: Managed in `style.css` via a `.light-theme` class applied to the `:root` pseudo-class, which overrides the default dark variables.
- **Persistence**: Checked and saved via `localStorage` in `script.js`. Dark mode is the absolute fail-safe default.

### Advanced Contact Form Attachment Handling
- Uses a hidden `<input type="file">` underneath a beautifully styled CSS drop-box (`.file-upload-btn`).
- JavaScript intercepts the `change` event, reads `this.files[0].name`, dynamically updates the text node, and changes the upload icon to a 'success' checkmark icon.
- Form submissions are caught by `e.preventDefault()`, packed into a `FormData` object, and sent to Formspree (`https://formspree.io/f/mjgpowbw`) silently via `fetch()`. The DOM injects a success/error message without redirecting the page.

### The Upwork Icon (CSS Mask Logic)
- An external raster icon (`.png`) from Icons8 is used for the Upwork logo.
- Instead of using a static `<img>` tag which ignores CSS hover colors, `style.css`/inline-styles apply `-webkit-mask: url(...)` with a `background-color: currentColor`. This forces the image silhouette to perfectly inherit the DOM's native text color variables.

### Video Embedding in Projects
- The `project.json` schema supports an optional `"videoEmbed"` property.
- When present, `script.js` generates a `16:9` responsive `<iframe src="...">` wrapper. The iframe utilizes absolute positioning over a `padding-bottom: 56.25%` container to maintain exact aspect ratios across all devices.

## 4. UI/UX Design System Guidelines

If you are generating new CSS or adding new components, **strict adherence to these variables is required.** Do not hardcode HEX values unless explicitly necessary for an exception.

### Core Variables (`style.css`)
```css
:root {
    /* Primary Colors */
    --bg-main: #0a0a0c;
    --bg-surface: #121216;
    --bg-surface-hover: #1c1c22;
    --bg-alt: #0d0d10;
    
    /* Text */
    --text-primary: #ededf0;
    --text-secondary: #a1a1aa;
    --text-muted: #71717a;
    
    /* Accents */
    --accent-primary: #3b82f6; /* Modern Blue */
    --accent-secondary: #10b981; /* Success Green */
    
    /* UI Structure */
    --border-color: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.15);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --transition-base: 0.3s ease;
}
```
- **Modals**: Must utilize `.modal-overlay` with `backdrop-filter: blur()`. Content containers must trigger a subtle `transform: translateY()` transition.
- **Padding**: Sections must use `.section` which enforces `6rem` vertical padding.

## 5. Potential Future Upgrades
If the User requests any of these, here is how the architecture would support it:
1. **CMS Integration**: Because all content is currently isolated in `/data/*.json`, replacing the static JSON fetches in `script.js` with literal API endpoints (e.g., Sanity.io, Strapi) would take under an hour.
2. **SEO Optimization**: Currently, it is a single-page app (SPA). If SEO becomes a priority, the AI should parse the JSON files natively via a static site generator (like Astro or Next.js) at build time. For now, basic `<meta>` tags solve the issue.
3. **Analytics**: Google Analytics or Vercel Web Analytics can be dropped natively into `index.html` at the bottom of the `<head>`.
