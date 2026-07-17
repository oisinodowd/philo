# Corpus Seed Plan — Saint Thomas Aquinas

## Overview

The initial Philo corpus seeds with the complete works of Saint Thomas
Aquinas, sourced from public-domain repositories and curated academic
sources. This document outlines the full structure and sourcing plan.

## Philosopher Metadata

- **Slug:** `thomas-aquinas`
- **Name:** Saint Thomas Aquinas
- **Name (native):** Sanctus Thomas Aquinas
- **Birth:** 1225, Roccasecca, Kingdom of Sicily
- **Death:** 1274, Fossanova, Papal States
- **Tradition:** Scholastic
- **Primary Category:** Theology
- **Secondary Categories:** Metaphysics, Ethics, Logic, Natural Philosophy

## Works to Ingest

### 1. Summa Theologica (Summa Theologiae)
- **Date:** 1265–1274
- **Language:** Latin
- **Source:** Project Gutenberg (English translation)
- **Structure:** 3 Parts + Supplement, 614 Questions, ~3,000 Articles
- **Key Passages:**
  - Prima Pars, Q1: Sacred Doctrine — nature and extent
  - Prima Pars, Q2: The Existence of God — Five Ways
  - Prima Pars, Q75–Q89: Treatise on Man — soul, intellect, will
  - Secunda Secundae, Q1–Q16: Theological Virtues — Faith
  - Tertia Pars, Q1–Q59: Christology

### 2. Summa contra Gentiles
- **Date:** 1259–1265
- **Language:** Latin
- **Source:** Project Gutenberg
- **Structure:** 4 Books, ~450 Chapters
- **Purpose:** Apologetic — truths accessible to reason

### 3. De Ente et Essentia (On Being and Essence)
- **Date:** ~1256
- **Language:** Latin
- **Source:** Internet Archive / The Aquinas Institute
- **Structure:** 6 Chapters
- **Key Topic:** Distinction between essence and existence

### 4. Quaestiones Disputatae
- **De Veritate** (On Truth) — 29 Questions
- **De Potentia** (On Power) — 10 Questions
- **De Malo** (On Evil) — 16 Questions
- **Source:** The Aquinas Institute / Internet Archive

### 5. Commentaries on Aristotle
- **De Anima** (On the Soul)
- **Metaphysics**
- **Nicomachean Ethics**
- **Physics**
- **Source:** various scholarly editions

## Sourcing Guidelines

- All sources must be in the public domain.
- Prefer Project Gutenberg for English translations of core works.
- Use Internet Archive for scans of Loeb/Oxford editions where available.
- Stanford Encyclopedia of Philosophy articles are used for bio
  summaries only, not for passage content.
- Wikipedia is used only for structured metadata (dates, work lists,
  categories), never for passage-level content.

## Ingestion Workflow

1. Prepare JSON manifest matching the `/admin/ingest` schema.
2. Submit via the admin panel (service-role auth required).
3. Passages are inserted with `published = false`.
4. Embeddings are generated asynchronously via OpenAI
   `text-embedding-3-small`.
5. A human reviewer approves passages via Supabase dashboard
   (set `published = true`).

## Passage Anchor Format

```
{philosopher_slug}:{book_id}:{chapter_id}:{offset}

Example: thomas-aquinas:st:1:1:1
```

This identifier is stable forever. Notes, highlights, and voice memos
reference it directly.
