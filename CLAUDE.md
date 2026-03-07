# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Ryan Murney — a static single-page site served by an Express backend. The site has four sections: Home, About, Projects, and Contact (with email functionality via EmailJS).

## Commands

- **Start (production):** `npm start` — runs `node server.js` on port 3000 (or `PORT` env var)
- **Start (dev):** `npm run dev` — runs `nodemon server.js` with auto-reload
- **No tests or linter configured**

## Architecture

This is a vanilla HTML/CSS/JS site with a Node.js server:

- `server.js` — Express server. Serves static files from `public/`, serves `index.html` at `/`, and handles `POST /email` using `@emailjs/nodejs` (credentials from `.env`)
- `index.html` — Single-page layout with sections: home, about, projects, contact. Uses Font Awesome via CDN
- `public/scripts/main.js` — Client-side JS: smooth-scroll navigation (`moveToPanel`), mobile menu toggle, contact form submission via `fetch('/email')`, toast notifications
- `public/css/index.css` — All styling. Responsive breakpoints at 600px, 768px, and 992px (mobile menu below 992px, desktop nav at 992px+)
- `public/src/` — Static images (project mockups, avatar, background)

## Environment Variables

Requires a `.env` file (gitignored) with EmailJS credentials: `SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY`, `PRIVATE_KEY`, and optionally `PORT`.
