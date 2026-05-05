# Orbital Dispatch Interview

## Story

You are the station manager for Asteria-9, a commercial refuel and repair station in low orbit. Cargo crews are docking, systems are drifting out of tolerance, incidents are being reported, and leadership needs a fast operational picture.

The dashboard should help operators filter station modules by status, check the active crew officer, update module status, and manage station incidents during a transfer window.

## Candidate Task

This is a 2-3 hour senior coding test.

Start by running the test suite. Several tests fail because the dashboard has bugs and the Station Incidents workflow is incomplete. Fix the app until the tests pass, then demo the workflow.

You should:

- Run the app.
- Run the tests.
- Use the UI.
- Trace API calls.
- Fix broken React logic.
- Fix broken Express API behavior.
- Build the Station Incidents workflow.
- Keep the UI attractive and usable.

## Run

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:4000/api

## Tests

```bash
npm test
```

The visible tests cover:

- Existing React bugs.
- Existing API bugs.
- Station Incidents API behavior.
- Station Incidents UI behavior.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Context
- Express
- Vitest
- React Testing Library
- Supertest

## Useful API Routes

Existing:

- `GET /api/health`
- `GET /api/overview`
- `GET /api/modules?status=stable`
- `GET /api/crew/:id`
- `PATCH /api/modules/:id/status`
- `GET /api/supplies/priority`

To implement:

- `GET /api/incidents`
- `POST /api/incidents`
- `PATCH /api/incidents/:id/resolve`

## Required Work

Fix existing issues:

1. Status filter is inverted.
2. Clear active officer does not clear.
3. Crew details can show "Crew member not found" for valid crew.
4. Module status update ignores the requested status.

Build Station Incidents:

- Load incidents.
- Display open and resolved incidents.
- Create a new incident.
- Resolve an incident.
- Validate incident input on the API.
- Show useful UI loading and error states.

Incident fields:

- `id`
- `title`
- `severity`: `low | medium | high`
- `status`: `open | resolved`
- `moduleId`
- `assignedCrewId`
- `createdAt`

Validation rules:

- `title` is required.
- `severity` must be `low`, `medium`, or `high`.
- `moduleId` must match an existing station module.
- `assignedCrewId` must match an existing crew member.

## Scoring

- Existing bug fixes: 40%
- Station Incidents backend: 25%
- Station Incidents frontend logic: 25%
- TypeScript/code quality: 10%
