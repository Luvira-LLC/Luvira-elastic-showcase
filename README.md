Luvira Elastic Showcase
Privacy-Preserving Contextual Memory UX built on Elasticsearch
This repository is the public interface showcase of Luvira’s Contextual Memory System.
It demonstrates how Luvira transforms from a stateless AI into a privacy-preserving contextual system — without storing raw audio or transcripts.

 This repository intentionally excludes proprietary backend logic and search heuristics.
 Purpose
Luvira solves the privacy vs personalization paradox.
Instead of storing:
 Raw audio
 Full transcripts
 Sensitive user data
We store:
Sanitized Insight Objects
Structured summaries (anchor_text)
Thematic metadata
Vector embeddings

This repo showcases:
Memory Badge UX
Context Drawer UI
Thinking / Recall states
Fail-Open recall wrapper
Strict TypeScript/Zod validation

Architecture Overview
Public Layer (This Repo):
TypeScript contracts
Zod schema validation
Mock recall adapter
Fail-open wrapper
Trust UX components
Private Layer (Not Included):
Insight derivation pipeline
PII sanitization engine
Embedding generation
Elasticsearch index mappings
Ranking heuristics
Production prompts
 Privacy Design Principles
Luvira’s memory layer:
Does not persist raw audio
Does not store full transcripts
Indexes only sanitized summaries
Hashes session identifiers
Enforces schema versioning
Fails gracefully if memory is unavailable
The system is designed to be:
Privacy-first
Versioned
Auditable
Resilient
 Core Concepts
InsightObject
A sanitized memory unit:
id
schema_version
timestamp
anchor_text
themes_array
snippet (optional, derived)
source_session_hash (optional, hashed)
RecallResult
Returns:
Top 3 similar memories
similarity_score (0–1)
latency_ms
Fail-Open Design
If Elasticsearch is unavailable:
No crash
No 500 error
Returns empty memory array
UX continues normally
Trust UX Components
Memory Badge
Appears when historical context is used.
Memory Drawer
Displays:
Date
Sanitized summary
Optional snippet
Thinking State
If recall latency > 1s:
“Consulting past sessions…”
“Synthesizing context…”
 Running the Demo
Bash
Copy code
npm install
npm start
The public demo uses a mock recall adapter.
No real Elasticsearch connection is included in this repository.
Repository Structure


src/
  recall/
    schema.ts
    contract.ts
    failOpen.ts
    mockAdapter.ts
  components/
    MemoryBadge.tsx
    MemoryDrawer.tsx
    ThinkingState.tsx
 Production-Grade Standards
Strict TypeScript types
Zod runtime validation
No hardcoded secrets
.env.example included
Fail-open architecture
Similarity logging
Latency tracking
Clean documentation
Strategic Positioning
This showcase demonstrates:
Scalable contextual AI architecture
Enterprise-ready data contracts
Privacy-by-design memory indexing
UX transparency in AI reasoning
Infrastructure moat via vector search
License
MIT License

