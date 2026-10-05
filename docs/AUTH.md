# Clerk authentication and roles

The frontend uses Clerk-hosted authentication flows embedded in the app. The sign-in and sign-up screens use the project's Figma palette and logo; Clerk also handles email verification, password recovery, and password reset.

## Local configuration

1. Create a Clerk application and enable the email/password methods needed by the team.
2. Copy `frontend/.env.example` to `frontend/.env` and enter the instance's publishable key. Set `BACKEND_ORIGIN` to the API origin; Vite uses it for the `/api` proxy.
3. Copy `backend/.env.example` to `backend/.env` and enter the matching secret key. Set `FRONTEND_ORIGIN` to the frontend origin allowed by CORS (multiple comma-separated origins are supported) and `BACKEND_ORIGIN` to the backend listen address. Vite also reads `FRONTEND_ORIGIN` from this file to select its own host and port.
4. Start the backend and frontend using the commands in `README.md`.

The frontend sends Clerk session tokens as bearer tokens when calling the backend. NestJS verifies each token with the Clerk secret key. `/health` is the only public backend endpoint; all other endpoints require a valid session.

## Roles

The supported roles are `user`, `supervisor`, and `admin`. Users without an explicit role are treated as `user`. The frontend reads Clerk `publicMetadata.role` to display role-gated UI, while the backend trusts only the Clerk-signed session claim.

In Clerk Dashboard, add this claim under **Sessions → Customize session token** so the backend can authorize roles:

```json
{
  "public_metadata": "{{user.public_metadata}}"
}
```

Assign roles through Clerk's trusted backend or Dashboard public metadata. Never accept role changes from browser form data. Role updates appear after Clerk refreshes the session token. For now, all organizer pages and backend endpoints are admin-only by default. Admins are allowed through role-restricted handlers; future `user` or `supervisor` access must be added explicitly with `RequireRole` in the frontend and `@Roles(...)` on the backend.

## Page access

All organizer pages require an admin Clerk session for now. Backend endpoints are protected independently, so a client-side route check is not the security boundary. Use the `RequireRole` component for role-gated frontend pages and `@Roles(...)` for corresponding backend endpoints.

## Profile data

The profile page updates first and last name, profile image, primary email address, and password through the signed-in Clerk user. Email changes are added as a secondary address, verified with an email code, and only then made primary. Enable first and last name editing and email-code verification in the Clerk Dashboard for these flows.

The profile's group, sync link, language, and theme preferences are stored in Clerk `unsafeMetadata` because users can edit them from the browser. Treat those values as user-controlled display/preferences data; never use them to grant access or determine a role. The role shown on the profile comes from Clerk `publicMetadata` and is read-only in the frontend.
