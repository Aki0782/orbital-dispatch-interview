# Graph Report - Interview  (2026-06-17)

## Corpus Check
- 29 files · ~6,337 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 185 nodes · 277 edges · 14 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ed0d1512`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `compilerOptions` - 11 edges
3. `Orbital Dispatch Interview` - 11 edges
4. `scripts` - 9 edges
5. `request()` - 9 edges
6. `StationModule` - 9 edges
7. `CrewMember` - 9 edges
8. `SupplyCrate` - 7 edges
9. `ModuleStatus` - 6 edges
10. `Incident` - 6 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useOperations()`  [EXTRACTED]
  src/App.tsx → src/context/OperationsContext.tsx

## Import Cycles
- None detected.

## Communities (14 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (28): CrewPanel(), CrewPanelProps, crew, severityOptions, StationIncidents(), StationIncidentsProps, crew, incidents (+20 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (20): dependencies, axios, cors, express, lucide-react, react, react-dom, name (+12 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (20): devDependencies, concurrently, jsdom, supertest, tailwindcss, @tailwindcss/vite, @testing-library/jest-dom, @testing-library/react (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (16): API Notes, Backend Requirements, Candidate Task, Data Rules, Demo Checklist, Issue Brief, Orbital Dispatch Interview, Required Work (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (10): OperationsContext, OperationsContextValue, OperationsProvider(), useOperations(), App(), crew, incidents, modules (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir, skipLibCheck (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.24
Nodes (8): MetricBar(), MetricBarProps, toneStyles, ModuleCard(), ModuleCardProps, StatusPill(), statusStyles, ModuleStatus

### Community 8 - "Community 8"
Cohesion: 0.25
Nodes (9): crew, incidents, modules, supplies, priorityRank, router, severities, statuses (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (6): app, app, app, createApp(), app, port

### Community 10 - "Community 10"
Cohesion: 0.38
Nodes (5): SupplyQueue(), SupplyQueueProps, modules, supplies, SupplyCrate

## Knowledge Gaps
- **114 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+109 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _114 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13015873015873017 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._