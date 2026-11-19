# Task: Arabic and Kurdish versions of the site

The website should be available in English, Arabic and Kurdish (Sorani), and visitors should be able to switch language from the navbar. This covers both pages: home (`/`) and careers (`/career`).

## What's needed

1. **Language switcher.** The navbar already has a language button ("En" on desktop, "English" in the mobile menu) that doesn't do anything yet. Make it switch between English, العربية and کوردی.

2. **Right-to-left layout.** Arabic and Kurdish are written right to left. When one of them is selected, the `<html>` tag in `app/layout.tsx` needs `dir="rtl"` and the matching `lang` (`ar` or `ckb`), and the layout has to mirror properly. Watch for classes that assume left-to-right, such as `text-left`, `pl-*`, `ml-*` and `left-*`. Tailwind has direction-aware versions (`text-start`, `ps-*`, `ms-*`, `start-*`) that flip automatically.

3. **Font.** Poppins and Bebas Neue don't include Arabic letters. Choose a font that covers Arabic and Kurdish (check it has Kurdish letters such as ڕ ڵ ۆ ێ ە), add it to `public/fonts/` and `app/globals.css` the same way as the existing fonts, and use it for the Arabic and Kurdish versions.

4. **Text in the code.** Translate everything written directly in the components: navigation, headings, buttons, form labels and placeholders, success and error messages, and the footer. See "Where the text is" in the README.

5. **Content in `data/site-content.json`.** Make one file per language with exactly the same structure: `data/site-content.ar.json` and `data/site-content.ckb.json`. On the live site each file becomes its own entry in the database, so:
   - translate only the text values (titles, descriptions, questions and answers, image `alt` text, job summaries, ...)
   - keep every key, `id` and image URL the same
   - keep values that come from a fixed list in English (`type`, `workMode`, `status`, `requiredFields`, `deadline`), and translate how they are displayed in the component instead

6. **Page titles and descriptions** in `app/layout.tsx` and `app/career/page.tsx`. These show in the browser tab, in Google results and in link previews.

How you organise the code is up to you, for example a separate address per language (`/ar`, `/ckb`) or remembering the choice in a cookie. Describe your approach in your first pull request, before translating everything.

## Suggested order

One pull request for each step:

1. Language switcher, right-to-left layout and the new font, with a few pieces of text translated to show it working
2. Arabic translation
3. Kurdish translation

## Done when

- Every piece of visible text on `/` and `/career` changes with the language, including form messages.
- The Arabic and Kurdish layouts look right on desktop and mobile, in both light and dark theme.
- Switching language keeps you on the same page.
- The English version looks exactly as it did before.
- `npm run build` passes.
