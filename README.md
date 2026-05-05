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

## Issue Brief

Several tests fail across the dashboard and the unfinished Station Incidents workflow. The broken behavior is intentionally spread across React state, Context behavior, API request handling, server route behavior, validation, and UI refresh behavior. Use the tests, browser, network calls, and TypeScript feedback to trace each broken flow from the user action to the server response and back to the rendered UI.

The existing dashboard has a few intentional bugs around filtering, selecting and clearing crew, loading details, and saving status changes. The incident panel has a visual starter, but the real workflow still needs to be built across the frontend and backend. Some fixes are small debugging tasks; others require adding the missing data flow end to end.

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

## API Notes

The app uses a small Express API with in-memory dummy data. Inspect the server routes, client API helpers, types, and tests to understand the expected contracts. Keep the implementation lightweight; no database or authentication is needed.

## Required Work

Fix the existing dashboard flows first. The starter has intentional issues in module filtering, active officer clearing, crew detail loading, and module status saving. The tests describe the visible behavior that should work; use the codebase to find the exact causes.

Then build Station Incidents. The panel should load incident data, allow a manager to create a safety incident, assign it to the right operational context, resolve it, validate bad input, and show useful loading or error feedback. Keep the data in memory and keep the shape aligned with the shared TypeScript types.

## Safety Incident Workflow

A safety incident is an operational issue that needs a crew member assigned and tracked until it is resolved.

Example incidents:

- Docking collar pressure alert
- Hydroponics misting drift
- Solar panel vibration spike
- Medical bay oxygen variance

### User Flow

The station manager should be able to:

1. Open the dashboard.
2. See current safety incidents.
3. Tell which incidents are open and which are resolved.
4. Create a new incident.
5. Assign it to a station module.
6. Assign it to a crew member.
7. Resolve an open incident.
8. See the UI update after create and resolve actions.

### UI Requirements

Build the Safety Incident UI inside the existing `Station Incidents` panel.

The panel should include:

- A list of incidents.
- A visible status for each incident: `open` or `resolved`.
- A visible severity for each incident: `low`, `medium`, or `high`.
- The module name for each incident.
- The assigned crew member name for each incident.
- A create incident form.
- A resolve button for open incidents.
- Loading state while incidents are loading.
- Error state when an API request fails.

The create form should include:

- Incident title text input.
- Severity select.
- Module select.
- Assigned crew select.
- Create button.

Do not require a page refresh. The local UI should update after a successful create or resolve action.

### Backend Requirements

Add the server behavior needed for incidents to be listed, created, and resolved. New incidents should be created as open incidents, server-generated fields should be owned by the server, missing records should be handled cleanly, and invalid input should return useful validation errors.

### Data Rules

- Use in-memory dummy data.
- Do not add a database.
- Do not add authentication.
- Keep the data shape aligned with `src/types/station.ts`.
- It is fine if data resets when the server restarts.

### Demo Checklist

During the live demo, show:

- Incidents load on the dashboard.
- A new incident can be created.
- Invalid form input shows a useful error.
- An open incident can be resolved.
- The resolved incident is visually marked as resolved.
- Tests pass after implementation.

## Scoring

- Existing bug fixes: 40%
- Station Incidents backend: 25%
- Station Incidents frontend logic: 25%
- TypeScript/code quality: 10%
