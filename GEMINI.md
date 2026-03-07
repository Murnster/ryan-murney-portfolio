# GEMINI.md - Ryan Murney Portfolio

## Project Overview
This is a personal portfolio website for Ryan Murney, a Software Developer based in Halifax, Nova Scotia. The project is a full-stack JavaScript application featuring a single-page frontend and a Node.js/Express backend.

### Main Technologies
- **Backend:** Node.js, Express.js
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Integrations:** EmailJS (via `@emailjs/nodejs`) for contact form submissions
- **Dev Tools:** Nodemon for local development, Dotenv for environment variable management

### Architecture
- **Server-side (`server.js`):** An Express server that serves static files from the `public/` directory and exposes a `/email` POST endpoint for contact form handling.
- **Client-side (`public/`):**
    - `index.html`: The main entry point, containing sections for Home, About, Projects, and Contact.
    - `public/scripts/main.js`: Handles frontend logic including smooth scrolling navigation (`moveToPanel`), mobile menu toggling, and AJAX contact form submission (`sendEmail`).
    - `public/css/index.css`: Contains all styling for the responsive design.
    - `public/src/`: Directory for static assets like images and icons.

## Building and Running

### Prerequisites
- Node.js (v14+ recommended)
- npm

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file in the root directory with the following variables for EmailJS integration:
- `PORT` (Optional, defaults to 3000)
- `SERVICE_ID`
- `TEMPLATE_ID`
- `PUBLIC_KEY`
- `PRIVATE_KEY`

### Running the Application
- **Production Mode:**
  ```bash
  npm start
  ```
- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```

### Testing
No automated tests are currently implemented.
```bash
npm test # Currently returns "no test specified"
```

## Development Conventions
- **Code Style:** Follow standard JavaScript conventions. Use descriptive function names and maintain the existing smooth-scrolling architecture for navigation.
- **Static Assets:** All images, icons, and mocks should be placed in `public/src/`.
- **Form Handling:** The contact form includes a simple `cleanTrolls` filter in `main.js` to prevent spam/unwanted messages before sending requests to the backend.
- **Responsive Design:** The application uses CSS media queries for responsiveness. Ensure any UI changes are tested on both mobile and desktop views.
