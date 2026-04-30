# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MedTupa — a static informational site for Tupaciguara, MG listing free medications (municipal pharmacy + federal Farmácia Popular program) and local pharmacies. Pure HTML + a single `style.css`, no build system, no JS dependencies, no package manager.

## Deploy

Pushes to `main` deploy the entire repository root to GitHub Pages via `.github/workflows/static.yml`. There is no build step — files are served as-is. To preview locally, open the HTML files directly in a browser or run any static server from the repo root (e.g. `python3 -m http.server`).

## Structure conventions

Four pages share the same shell — `<header>`, `<nav>` (omitted on `index.html`), `<main>`, `<footer>` — all linked to `style.css`. When adding a page, mirror this shell and add a `<nav>` link on every other page; mark the current page's nav link with `class="active"`.

The footer's `Última atualização: DD/MM/YYYY` is duplicated across all four HTML files. Update them together when making content changes.

## Pharmacy "open now" status (`farmacias.html`)

Each `<article class="pharmacy">` carries hours as data attributes consumed by an inline `<script>` at the bottom of the file:

- `data-mon-fri="HH:MM-HH:MM"` — weekday hours
- `data-sat="HH:MM-HH:MM"` or `"closed"`
- `data-sun="HH:MM-HH:MM"` or `"closed"`

The script computes status client-side and injects a `<p class="status status-open|status-closed">` after the `<h3>`. The visible "Horário" text inside `<dd class="hours">` is independent — keep both the data attributes and the human-readable hours in sync when editing.

Address links use `https://www.google.com/maps/search/?api=1&query=<URL-encoded address>`; phone links use `tel:+55XX...` (E.164). CSS removes underlines from these links by default and adds them on hover.
