# Clerk authentication and roles

The frontend uses Clerk-hosted authentication flows embedded in the app. The sign-in and sign-up screens use the project's Figma palette and logo; Clerk also handles email verification, password recovery, and password reset.

## Local configuration

1. Create a Clerk application and enable the email/password methods needed by the team.
2. Copy `frontend/.env.example` to `frontend/.env` and enter the instance's publishable key. Set `BACKEND_ORIGIN` to the API origin; Vite uses it for the `/api` proxy.
3. Copy `backend/.env.example` to `backend/.env` and enter the matching secret key. Set `FRONTEND_ORIGIN` to the frontend origin allowed by CORS (multiple comma-separated origins are supported) and `BACKEND_ORIGIN` to the backend listen address. Vite also reads `FRONTEND_ORIGIN` from this file to select its own host and port.
4. Start the backend and frontend using the commands in `README.md`.

The frontend sends Clerk session tokens as bearer tokens when calling the backend. NestJS verifies each token with the Clerk secret key. `/health` is the only public backend endpoint; all other endpoints require a valid session.

## Roles

The app has three roles: `student`, `starosta`, and `admin`. Clerk `publicMetadata.role` keeps its original values and they are mapped onto app roles:

| Clerk `publicMetadata.role` | App role   | Capabilities |
| --------------------------- | ---------- | ------------ |
| *(missing or unknown)*      | `student`  | Read own schedule, tasks, disciplines, calendar, events |
| `user`                      | `student`  | Same as above |
| `supervisor`                | `starosta` | Everything a student can do, plus editing the schedule and tasks of the own group (`users.groupId`) and moving students between groups |
| `admin`                     | `admin`    | Everything, plus group management, the student directory, and college-wide events |

The mapping lives in `resolveAppRole` (`backend/src/auth/auth.types.ts` and `frontend/src/features/auth/roles.ts`). Unknown values degrade to the least privileged role, so a typo in Clerk never grants organizer access.

The frontend reads Clerk `publicMetadata.role` to render the sidebar and to decide which routes to mount, while the backend trusts only the Clerk-signed session claim and is the source of truth for permissions.

In Clerk Dashboard, add this claim under **Sessions → Customize session token** so the backend can authorize roles:

```json
{
  "public_metadata": "{{user.public_metadata}}"
}
```

Assign roles through Clerk's trusted backend or Dashboard public metadata. Never accept role changes from browser form data. Role updates appear after Clerk refreshes the session token.

A starosta also has to be attached to a group: `PATCH /manage/admin/students/:userId/group` sets `users.groupId`. Until that group is set, the starosta endpoints answer `403` so a supervisor cannot edit another group's data.

## Page access

| Route       | Roles                    | Purpose |
| ----------- | ------------------------ | ------- |
| `/`         | student, starosta, admin | Dashboard |
| `/schedule`, `/assignments`, `/disciplines`, `/calendar`, `/events`, `/profile` | student, starosta, admin | Read-only pages; schedule editing is offered only through `/manage` |
| `/manage`   | starosta, admin          | Schedule, tasks, and group students; admins additionally manage groups and college events |
| `/students` | admin                    | Group list, student directory, and group assignment |

`RequireRole` in `src/features/auth/guards.tsx` mounts those routes and confirms the role through `GET /manage/me`, so the UI and the API never disagree. Backend endpoints are protected independently with `@Roles(...)`; a client-side route check is not the security boundary.

### Management API (`/manage`)

| Method | Path | Roles |
| ------ | ---- | ----- |
| `GET` | `/manage/me` | any session |
| `GET` | `/manage/admin/groups` | admin |
| `POST` | `/manage/admin/groups` | admin |
| `DELETE` | `/manage/admin/groups/:groupId` | admin |
| `GET` | `/manage/admin/students?groupId=` | admin |
| `GET` | `/manage/students` | starosta, admin (own group) |
| `PATCH` | `/manage/admin/students/:userId/group` | starosta, admin |
| `GET` | `/manage/groups/:groupId/schedule` | starosta, admin |
| `PUT` | `/manage/groups/:groupId/schedule/lesson` | starosta, admin |
| `DELETE` | `/manage/groups/:groupId/schedule/lesson` | starosta, admin |
| `GET` | `/manage/disciplines` | starosta, admin |
| `GET` | `/manage/groups/:groupId/tasks` | starosta, admin |
| `POST` | `/manage/tasks` | starosta, admin |
| `PATCH`, `DELETE` | `/manage/tasks/:taskId` | starosta, admin |
| `GET` | `/manage/events` | starosta, admin |
| `POST` | `/manage/events` | admin |
| `PATCH`, `DELETE` | `/manage/events/:eventId` | admin |

A starosta is always scoped to the group recorded in `users.groupId`; requesting another group's schedule or tasks answers `403`.

Locally created tasks are stored with a negative `moodleId`/`cmid` so they never collide with Moodle identifiers. Schedules are stored as JSON in `schedule.schedule` (`numerator`/`denominator` × 6 weekdays × 6 slots) and are created automatically the first time a group's schedule is edited.

## Profile data

The profile page updates first and last name, profile image, primary email address, and password through the signed-in Clerk user. Email changes are added as a secondary address, verified with an email code, and only then made primary. Enable first and last name editing and email-code verification in the Clerk Dashboard for these flows.

The profile's group, sync link, language, and theme preferences are stored in Clerk `unsafeMetadata` because users can edit them from the browser. Treat those values as user-controlled display/preferences data; never use them to grant access or determine a role. The role shown on the profile comes from Clerk `publicMetadata` and is read-only in the frontend.
