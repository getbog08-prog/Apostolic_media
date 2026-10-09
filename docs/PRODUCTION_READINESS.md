# Apostolic Media — Production Readiness

This checklist distinguishes completed application foundations from integrations that require external provider setup.

## Release gates

- [ ] Set `ENVIRONMENT` to `production` and `DEBUG` to `false` only after staging verification.
- [ ] Use Supabase Auth only in production; local demo sign-in must never create a trusted authenticated session.
- [ ] Enforce all role and ownership checks with PostgreSQL RLS and server-side policies. Hiding admin UI is not authorization.
- [ ] Review every `public` table policy and remove overlapping permissive policies only after verifying intended access.
- [ ] Enable leaked-password protection in Supabase Auth.
- [ ] Verify the `Apostolic_Media` Storage bucket exists and has least-privilege policies; test upload, read, delete, and large files.
- [ ] Test media playback on Android Chrome, desktop Chrome/Firefox/Safari, slow networks, and signed/private media URLs.
- [ ] Align app version and default language across `js/config.js`, `js/app.js`, and `index.html`.
- [ ] Verify PWA install, cache refresh, offline fallback, and all service-worker core paths.
- [ ] Add licensed Bible text and confirm rights for all uploaded audio/video/lyrics.
- [ ] Configure custom domain, HTTPS, error monitoring, backups, and recovery process.
- [ ] Integrate CBE/Telebirr, live streaming, and push notifications only after provider accounts, credentials, callback validation, and server-side verification are available.

## Important security rules

- Never commit a Supabase service-role/secret key to the browser or repository.
- Do not trust `role` values stored in browser storage or user-editable metadata.
- Public publishable keys are safe to expose only when database and storage RLS policies are correctly configured.
- Never report a payment as successful based only on a client-side callback.

## Verification record

Record date, browser/device, test account role, expected result, actual result, and any issue for every manual test. A successful static deployment does not establish that production authentication, media delivery, payments, or live streaming work.