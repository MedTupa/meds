# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MedTupa — a static informational site for Tupaciguara, MG listing free medications (municipal pharmacy + federal Farmácia Popular program) and local pharmacies. Pure HTML + a single `style.css`, no build system, no JS dependencies, no package manager.

## Deploy

Pushes to `main` deploy the entire repository root to GitHub Pages via `.github/workflows/static.yml`. There is no build step — files are served as-is. To preview locally, open the HTML files directly in a browser or run any static server from the repo root (e.g. `python3 -m http.server`).

## Structure conventions

Five pages (`index.html`, `medicamentos.html`, `farmacia-popular.html`, `farmacias.html`, `info.html`) share the same shell — an inline `<svg>` symbol sprite at the top, then `<div class="app">` containing `<header class="app-header">` (brand + location pin), the page body, `<footer class="app-footer">`, and a fixed `<nav class="bottom-nav">` (Início / Busca / Farmácias / Info). Mark the current tab's link with `class="active"`. The `.app` wrapper constrains layout to a mobile-width column (~460px) and pads the bottom to leave room for the fixed nav.

The footer's `Última atualização: DD/MM/YYYY` is duplicated across all five HTML files. Update them together when making content changes.

Icons are inline SVG `<symbol>`s with `i-*` IDs (e.g. `i-pin`, `i-clock`, `i-pharmacy`); reuse `<use href="#i-x"/>` rather than re-defining symbols. Each page only inlines the icons it uses.

## Pharmacy "open now" status (`farmacias.html`)

Each `<article class="pharmacy">` carries hours as data attributes consumed by an inline `<script>` at the bottom of the file:

- `data-mon-fri="HH:MM-HH:MM"` — weekday hours
- `data-sat="HH:MM-HH:MM"` or `"closed"`
- `data-sun="HH:MM-HH:MM"` or `"closed"`

The script computes status client-side and injects a `<p class="status status-open|status-closed">` after the `<h3>`. The visible "Horário" text inside `<dd class="hours">` is independent — keep both the data attributes and the human-readable hours in sync when editing.

The home page (`index.html`) has its own inline `HOURS` array — one `{ mf, sat, sun }` entry per pharmacy, in the same order — used to compute "N farmácias abertas agora" on the landing card. When pharmacy hours change in `farmacias.html`, update the corresponding entry in this array too.

## Responsive layout

The site is mobile-first. `.app` constrains content to ~460px on small screens (single column with a fixed bottom nav). At `min-width: 760px` it expands to ~1040px: the landing cards switch to a 2-column grid (`.layout`), with sections that need full width carrying a `.wide` class (`grid-column: 1 / -1`). On internal pages, `.indication-list` becomes 2-col (3-col at ≥ 1100px) and `.pharmacy-grid` becomes 2-col. The bottom nav widens to match `.app` and lays out icons horizontally next to labels.

Address links use `https://www.google.com/maps/search/?api=1&query=<URL-encoded address>`; phone links use `tel:+55XX...` (E.164). CSS removes underlines from these links by default and adds them on hover.
