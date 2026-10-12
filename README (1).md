# Cyber Journey Tracker

A 90-day study tracker and resume builder for students aiming for cybersecurity, SOC analyst and security analyst internships.

**Live site:** `https://muhammadamirulaiman0808-ops.github.io/cyber-journey/` (replace after you turn on GitHub Pages)

## What it does

- **Today:** progress ring, study streak, today's study blocks and the next tasks.
- **Timeflow:** a 13-week strip, plus a focus and deliverables for each month.
- **Checklist:** about 50 tasks with checkboxes, estimated hours, and links to labs, videos and docs (TryHackMe, PortSwigger Web Security Academy, LetsDefend, Packet Tracer and more).
- **Timetable:** a Monday to Sunday study plan of about 20 hours a week, with hours done against planned.
- **Resume builder:** tick a task and the matching skill, project line, training line or certification is added to the CV. Add clubs and activities, then export to Word (.docx), Markdown, plain text or HTML, or print to PDF.

## How it works

- One static file: `index.html`. No server, no account, no tracking.
- Progress and CV details are saved in your own browser (localStorage). Nobody else can see them.
- Use **Today, Save backup** to move your progress to another device.
- The Word export is built in the browser with [JSZip](https://stuk.github.io/jszip/), loaded from cdnjs.

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
