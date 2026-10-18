# Cyber Journey Tracker

A 90-day study tracker, career map and resume builder for students aiming for cybersecurity, SOC analyst and security analyst internships.

**Live site:** `https://YOUR-USERNAME.github.io/YOUR-REPO/` (replace after you turn on GitHub Pages)

## What it does

- **Today:** progress ring, study streak, today's study blocks and the next tasks.
- **Timeflow:** a 13-week strip, plus a focus and deliverables for each month.
- **Checklist:** about 50 tasks with checkboxes, estimated hours, and links to labs, videos and docs (TryHackMe, PortSwigger Web Security Academy, LetsDefend, Packet Tracer and more).
- **Timetable:** a Monday to Sunday study plan of about 20 hours a week, with hours done against planned.
- **Career:** a 10-level map from Foundation to Leadership. Levels 1 to 3 fill in from your checklist, and from Level 4 you tick milestones. Compare four paths (blue team, offensive security, network and cloud, AI and security), mark a main path and the ones you are also exploring.
- **News:** about 50 curated sources for security news, alerts and CVEs, AI and tech, economy and tech business, labs, podcasts and communities, with Malaysian sources marked. Search them and star your daily favourites.
- **Resume builder:** tick a task and the matching skill, project line, training line or certification is added to the CV. Add clubs and activities, then export to Word (.docx), Markdown, plain text or HTML, or print to PDF.

## How it works

- Static files only. No server, no account, no tracking. `index.html` is the whole app; the other files add the home screen icon and offline use.
- Progress, CV details, your chosen path and starred sources are saved in your own browser (localStorage). Nobody else can see them.
- Live headlines cannot load inside the page, so the News tab links out to each source.
- Use **Today, Save backup** to move your progress to another device.
- The Word export is built in the browser with [JSZip](https://stuk.github.io/jszip/), loaded from cdnjs.

## Install on your phone

Once the site is live on GitHub Pages (https), open it in Chrome on Android and tap the menu, then **Install app** (or **Add to Home screen**). On iPhone use Safari, **Share**, **Add to Home Screen**. The icon comes from `icon-*.png` and `manifest.webmanifest`. After the first visit the page also opens offline.

If you change the page and upload it again, the installed app picks up the new version the next time it opens with internet.

## Files to upload

`index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `README.md`. Keep them all in the same folder.

## Run it

Open `index.html` in a browser, or turn on GitHub Pages (Settings, Pages, deploy from the main branch).

## Make it yours

The plan is plain data at the top of the script in `index.html`:

- `TASKS`: the checklist, with weeks, hours, links and the CV lines each task adds.
- `WEEK`: the weekly timetable.
- `MONTHS` and `WF`: the month focus and weekly focus text.
- `BASE` and `PROJ`: the skills and projects that always appear on the CV.

## Notes

- Built with AI assistance (Claude). Edit this line to match how you worked on it.
- Do not commit backup files or CV exports that contain your phone number or email.
