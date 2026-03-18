# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

bezier-easing is a micro-library that provides cubic Bezier curve easing functions, equivalent to CSS `transition-timing-function: cubic-bezier(...)`. It uses Newton-Raphson iteration, binary subdivision, and precomputed sample tables for fast, precise x→y projection on Bezier curves.

## Commands

- **Test:** `npm test` (runs vitest)
- **Lint:** `npm run lint` (eslint)
- **Format:** `npm run format` (prettier --write) / `npm run format:check`
- **Benchmark:** `npm run benchmark`
- **Build:** `npm run prepublish` (esbuild → dist/)

## Architecture

Single-file library (`src/index.js`) exporting a factory function `bezier(mX1, mY1, mX2, mY2)` that returns an easing function `(x) => y`. X values must be in [0, 1]; Y values are unconstrained. Linear curves (where x1===y1 && x2===y2) short-circuit to identity.

The algorithm precomputes 11 sample points on the curve, then for a given x: looks up the nearest sample interval, estimates t via linear interpolation, and refines using Newton-Raphson (if slope is steep enough) or binary subdivision (fallback).

## Code Style

Enforced by Prettier (`.prettierrc`) + ESLint (`eslint.config.mjs`). 2-space indent, double quotes, semicolons, trailing commas (es5), unix line endings. CI runs both `format:check` and `lint`.
