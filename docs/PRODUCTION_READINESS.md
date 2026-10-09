# Apostolic Media — Production Readiness

Last reviewed: 2026-10-09

This checklist distinguishes changes already committed/applied from release gates that still require provider or browser verification.

## Completed in this hardening pass

- [x] Removed fake local sign-up/sign-in identities. Authentication now requires a real Supabase Auth session.
- [x] Prevented browser-stored user data and editable user metadata from granting privileged UI roles.
- [x] Added a database trigger to block users from assigning themselves privileged roles or verification status.
- [x] Applied the profile-role guard to the connected Supabase project and included it in the fresh-install schema.
- [x] Restricted media uploads to each authenticated user's own Storage folder.
- [x] Set the public media bucket to a 250 MiB upload limit and an explicit list of image/audio/video/PDF MIME types.
- [x] Aligned the app version and Amharic default language across the config, app controller, and HTML document.
- [x] Replaced the invalid PNG app-icon reference with a scalable SVG icon and updated the service-worker cache version.
- [x] Added GitHub Actions checks for JavaScript syntax, required files, manifest validity, version alignment, and default language.

## Remaining release gates

- [ ] Enable leaked-password protection in Supabase Auth. The project advisor still reports this setting disabled: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- [ ] Review every public-table RLS policy and all Storage policies against the intended product roles; confirm no redundant permissive policies unintentionally broaden access.
- [ ] Confirm the public bucket is appropriate for all content. Anything uploaded there is publicly retrievable by URL; use a private bucket and signed URLs for restricted content.
- [ ] Run the GitHub Actions validation workflow and fix any failures.
- [ ] Test registration, email confirmation, sign-in/out, password reset, profile editing, upload/delete, media playback, and offline/PWA installation in real browsers and on Android.
- [ ] Confirm all existing media rows and object paths work after the owner-folder upload change; legacy objects may need a controlled migration.
- [ ] Add licensed Bible text and verify redistribution rights for all songs, lyrics, audio, and video.
- [ ] Configure custom domain, HTTPS, monitoring, backups, and a tested recovery process.
- [ ] Integrate CBE/Telebirr, live streaming, and push notifications only after provider accounts, credentials, callback validation, and server-side verification are available.

## Important security rules

- Never commit a Supabase service-role/secret key to the browser or repository.
- Do not trust roles stored in browser storage or user-editable metadata.
- Public publishable keys are safe to expose only when database and Storage policies are correctly configured.
- Never report a payment as successful based only on a client-side callback.

## Verification record

Record date, browser/device, test account role, expected result, actual result, and any issue for every manual test. A successful static deployment does not establish that production authentication, media delivery, payments, or live streaming work.
