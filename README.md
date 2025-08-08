# Rollup saas demo

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/specialoperatives-projects/v0-rollup-saas-demo)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/rsAlqLx2xzX)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/specialoperatives-projects/v0-rollup-saas-demo](https://vercel.com/specialoperatives-projects/v0-rollup-saas-demo)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/rsAlqLx2xzX](https://v0.dev/chat/projects/rsAlqLx2xzX)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Okapiq Agent/API Endpoints (New)

- POST `/api/agent-google-scape`
  - body: `{ "search": "HVAC near Phoenix", "location?": "Phoenix, AZ", "industry?": "HVAC", "limit?": 5 }`
  - returns enriched profiles merged from Google, Yelp, DataAxle, Census

- POST `/api/searcher`
  - body: `{ "prompt": "Find me HVAC companies in Phoenix with outdated websites, high reviews, but low ad spend.", "limit?": 5 }`
  - parses intent and performs the same pipeline as GoogleScape

- POST `/api/google`
  - body: `{ "query": "HVAC near Phoenix", "limit?": 5 }`
  - Google Places text search + details (mock fallback without key)

- POST `/api/yelp`
  - body: `{ "term": "HVAC", "location": "Phoenix, AZ", "limit?": 5 }`
  - Yelp Fusion search (mock fallback without key)

- POST `/api/ghostcheck`
  - body: `{ "naics": ["238220"], "zip?": "85001", "limit?": 20 }`
  - DataAxle pull + simple benchmarking to produce MSI-like output

- POST `/api/sba`
  - body: `{ "csv": "..." }` or `{ "url": "https://.../sba.csv" }`
  - Parses minimal fields and computes a basic succession_score

- POST `/api/normalize`
  - body: `{ "records": [...] }`
  - Normalizes heterogeneous business-like records into a common schema
