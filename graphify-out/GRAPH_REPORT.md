# Graph Report - .  (2026-06-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 71 nodes · 139 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bec8f038`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]

## God Nodes (most connected - your core abstractions)
1. `request()` - 9 edges
2. `StationModule` - 6 edges
3. `CrewMember` - 6 edges
4. `ModuleStatus` - 5 edges
5. `DashboardFilter` - 5 edges
6. `SupplyCrate` - 4 edges
7. `Incident` - 4 edges
8. `StationOverview` - 4 edges
9. `OperationsProvider()` - 3 edges
10. `useOperations()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useOperations()`  [EXTRACTED]
  App.tsx → context/OperationsContext.tsx

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.21
Nodes (7): crew, incidents, modules, OperationsContextValue, OperationsProvider(), DashboardFilter, StationOverview

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (7): App(), filters, SupplyQueue(), SupplyQueueProps, useOperations(), StationModule, SupplyCrate

### Community 2 - "Community 2"
Cohesion: 0.33
Nodes (10): api, createIncident(), getCrewMember(), getIncidents(), getModules(), getOverview(), getPrioritySupplies(), request() (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.31
Nodes (6): MetricBar(), toneStyles, ModuleCardProps, StatusPill(), statusStyles, ModuleStatus

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (8): CrewPanel(), CrewPanelProps, severityOptions, CreateIncidentPayload, CrewMember, Incident, IncidentSeverity, IncidentStatus

### Community 7 - "Community 7"
Cohesion: 0.29
Nodes (8): crew, incidents, modules, supplies, priorityRank, router, severities, statuses

### Community 8 - "Community 8"
Cohesion: 0.38
Nodes (4): createApp(), app, port, app

## Knowledge Gaps
- **20 isolated node(s):** `modules`, `crew`, `incidents`, `filters`, `CrewPanelProps` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `StationModule` connect `Community 1` to `Community 2`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `ModuleStatus` connect `Community 3` to `Community 1`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `modules`, `crew`, `incidents` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._