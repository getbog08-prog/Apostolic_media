# 🕎 የኢየሱስ ልጆች Apostolic Media

> Wherever you are, join the same Apostolic Christian community.

A modern, responsive Apostolic Christian digital platform foundation covering Bible, worship, songs, lyrics, teachings, sermons, videos, Bible study, community, Q&A, live rooms, events, playlists, creator tools, wallet, admin and PWA foundations.

## Included

- Modern responsive SPA shell
- Light / dark theme
- Mobile bottom navigation + desktop sidebar
- Global search UI
- Home dashboard
- Songs + global media player demo
- Lyrics
- Teachings / folder UI
- Sermons
- Videos
- Bible books + reader
- Bible Study
- Community / Q&A / Live / Events foundations
- Downloads / Saved / Playlists foundations
- Creator dashboard + analytics-style cards
- Wallet + withdrawal workflow UI
- Admin foundation
- Amharic / English / Afaan Oromoo language preference
- PWA manifest + service worker
- Supabase schema with RLS policies
- GitHub Actions validation
- Netlify configuration

## Run locally

This is a static ES-module application. A local web server is recommended because ES modules and the service worker are not reliable from `file://`.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub

1. Create a repository, e.g. `apostolic-media`.
2. Upload the entire project folder.
3. Commit and push.
4. Enable GitHub Pages if you want a simple static preview, or connect the repo to Netlify.

## Supabase

For a **new project**:

1. Create a Supabase project and run `supabase/schema.sql` in SQL Editor.
2. Run `supabase/secure_media_storage.sql` to configure the public media bucket, upload limit, MIME allowlist, and owner-folder upload policy.
3. Run `supabase/guard_media_publication.sql` to restrict publishing to admins.
4. Copy the project URL and public publishable/anon key into `js/config.js`.
5. Never put a service-role/secret key in browser code or GitHub.

For the **existing connected project**, the matching schema/security migrations were applied during this hardening pass. SQL files under `supabase/` document the profile-role guard, schema alignment, storage restrictions, media publication guard, and consolidated RLS policies for repeatable setup and review.

`js/supabase.js` creates the client only when the URL and public key are configured. Authentication fails closed if Supabase Auth is unavailable; it does not create fake local users.

## Important production boundaries

The current project intentionally provides safe UI/database foundations for features that require external infrastructure. Real-time live streaming, CBE/Telebirr payment APIs, push infrastructure, copyright enforcement and production AI recommendations require verified provider accounts, credentials, policies and/or separate backend services. They should not be faked in production.

## Architecture

`index.html` is the app shell. Feature behavior is split into JavaScript modules. Styling is separated into base, theme and responsive files. Supabase is configured through `js/config.js`; full production readiness still depends on browser/device verification and external services.

## Next production work

- Connect real content tables and storage buckets
- Add authenticated creator/admin guards
- Add real upload processing and media transcoding
- Add real Bible content licensed for redistribution
- Add streaming/WebRTC infrastructure
- Add push notifications
- Add verified payment-provider integration
- Add server-side moderation/copyright workflows
- Add automated browser/device testing
- Configure custom domain + HTTPS + production monitoring
