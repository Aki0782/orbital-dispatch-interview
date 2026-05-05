# Orbital Dispatch Interview

## Story

You are the station manager for Asteria-9, a commercial refuel and repair station in low orbit. Cargo crews are docking, systems are drifting out of tolerance, and leadership needs a fast operational picture.

The dashboard should help operators filter station modules by status, check the active crew officer, and update module status during a transfer window.

## Candidate Task

The candidate has 30 minutes to stabilize the dashboard and API.

They should:

- Run the app.
- Use the UI.
- Trace API calls.
- Fix broken React logic.
- Fix broken Express API behavior.
- Keep the UI intact.


## Interviewer Notes

There are 4 intended issues.

1. Status filter is inverted.
2. Clear active officer does not clear.
3. Crew details section shows "Crew member not found"
4. Module status update


## Run

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:4000/api

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Context
- Express

## Useful API Routes

- `GET /api/health`
- `GET /api/overview`
- `GET /api/modules?status=stable`
- `GET /api/crew/:id`
- `PATCH /api/modules/:id/status`
- `GET /api/supplies/priority`

