# Jasmine Website (development copy)

This is a copy of the [jasmine.krd](https://jasmine.krd) website that you can run on your own laptop. Change the design, the text and the code as much as you like. Nothing you do here affects the live site.

It is the same website as the live one, with a few differences:

- The text and images for the home and careers pages come from `data/site-content.json`. On the live site they come from a database and are edited in an admin dashboard, which is not part of this copy.
- The contact form and the job application form work, but nothing is emailed or saved. Each submission is printed in the terminal where the site is running.

The current task is described in [TASKS.md](TASKS.md).

## What you need

- **Node.js 20.9 or newer.** Download the LTS version from [nodejs.org](https://nodejs.org). Check with `node -v`.
- **Git.** Download from [git-scm.com](https://git-scm.com). Check with `git --version`.
- **A GitHub account** that has been added to this repository.
- **A code editor.** VS Code works well.

## Running the site

```bash
git clone https://github.com/sh1dman/jasmine-website-demo.git
cd jasmine-website-demo
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Page | Address |
| --- | --- |
| Home | http://localhost:3000 |
| Careers | http://localhost:3000/career |

The browser updates by itself every time you save a file. To stop the site, press `Ctrl + C` in the terminal.

`npm install` is only needed the first time, and again if `package.json` changes. It may print some warnings; those are fine. Only errors need attention.

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site at localhost:3000 while you work |
| `npm run build` | Makes a production build. Run it before every pull request to make sure nothing is broken |
| `npm run lint` | Checks the code for common mistakes |

`npm run lint` already reports some problems in a few older components. You don't need to fix those unless your task touches that code.

## Project structure

```
app/
  layout.tsx          wrapper around every page: <html> tag, page title, description
  page.tsx            home page, puts the sections together in order
  career/page.tsx     careers page
  globals.css         colours, fonts, light and dark theme
  api/                code behind the contact and job application forms
components/
  preview/            home page sections: navbar, hero, about, services, portfolio, FAQ, contact form, footer
  career/             careers page: hero, job list, application form
  ui/                 small shared pieces: logo, theme toggle
data/
  site-content.json   text and images for the home and careers pages
types/
  career.ts           job openings and application form settings (form field names live here)
public/               images and font files
design_ref/           screenshots of the original design, for reference
```

The site is built with [Next.js](https://nextjs.org/docs) (React) and styled with [Tailwind CSS](https://tailwindcss.com/docs). Styles are the class names inside `className="..."`. Colours are defined once in `app/globals.css` for both the light and dark theme, so use the existing colour names (`text-primary`, `bg-card`, `text-text-main`, ...) rather than new hex values.

## Where the text is

Text on the site comes from two places:

1. **Written directly in the code.** Navigation links, headings like "WE ARE" and "ASK A QUESTION", form labels and placeholders, buttons, success and error messages, and the footer. Most of it is in `components/`. Form field names are in `types/career.ts`, and some error messages come from the form code in `app/api/`.
2. **`data/site-content.json`.** Hero slides, the about text, services, portfolio, FAQ and job openings. This is the part the team edits from the admin dashboard on the live site.

If you can't find where a piece of text comes from, search the whole project in your editor (`Cmd + Shift + F` on Mac, `Ctrl + Shift + F` on Windows).

## How to work on a change

Don't work directly on `main`. Every piece of work goes on its own branch and comes back as a pull request, which is reviewed before it is merged.

1. Get the latest code:
   ```bash
   git checkout main
   git pull
   ```
2. Create a branch for your change. Name it after what you are doing:
   ```bash
   git checkout -b language-switcher
   ```
3. Make your changes and check them in the browser. Commit often, with a short message that says what changed:
   ```bash
   git add .
   git commit -m "Add language switcher to the navbar"
   ```
4. Push the branch to GitHub:
   ```bash
   git push -u origin language-switcher
   ```
5. On GitHub, open a pull request from your branch into `main`. Say what you changed and why, and add screenshots for anything visual.
6. If changes are requested, make them on the same branch, then commit and push again. The pull request updates by itself.
7. When the pull request is merged, start again from step 1 for the next piece of work.

### Before you open a pull request

- `npm run build` finishes without errors.
- You checked the change on a desktop-sized window and a phone-sized one (in the browser's developer tools, use the device toolbar).
- You checked it in both the light and the dark theme (toggle in the navbar).
- The pull request only contains changes for that task.

## Ground rules

- **Don't rename or move existing files and folders** unless the task asks for it. Approved work is copied into the live site's code, and that is much easier when files stay where they are.
- **Ask before adding a new npm package.**
- **Keep the structure of `data/site-content.json`** (the same keys and nesting). The live site's database stores the content in exactly this shape.
- **Never commit passwords, keys or `.env` files.** This copy doesn't need any.
