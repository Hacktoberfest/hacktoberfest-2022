# Typeform Popup Buttons Design

## Goal

Open every Typeform call to action rendered by the Hacktoberfest frontend in
an on-site popup using Typeform's official React Embed SDK. Visitors must no
longer navigate away from Hacktoberfest when they open either the interest or
sponsor form.

## Scope

Convert the Typeform calls to action in these components:

- `Header`, including its standalone rendering on the 404 and subscribed pages
- `Hero`
- `GetInvolvedSection`
- `WaysInSection`, which is currently hidden but already contains Typeform
  calls to action

Partner links and every other non-Typeform link remain ordinary anchors.

## Architecture

Add `@typeform/embed-react` and introduce a small shared `TypeformButton`
adapter around its `PopupButton`. The adapter accepts a form configuration and
passes the form ID, tracking parameters, and URL parameters to the SDK. It also
accepts `className` so the existing styled-components definitions can style it
without duplicating the popup behavior.

Change the Typeform entries in `src/data/links.js` from complete outbound URLs
to popup configurations. Each configuration contains:

- the Typeform form ID;
- the existing placement-specific UTM values as SDK `tracking` parameters; and
- `organizer_interest` as an SDK URL parameter where the current CTA
  preselects the host or attendee path.

The SDK component renders a semantic button. Existing CTA styles will be
adapted to account for button defaults while retaining the current visual
appearance, focus treatment, and responsive layout.

## Interaction Flow

1. The visitor activates a Typeform CTA.
2. `PopupButton` opens the configured Typeform over the current page.
3. Typeform receives the CTA's existing campaign attribution and, where
   applicable, the host or attendee preselection.
4. Closing the popup returns focus and context to the Hacktoberfest page.

There is no custom submission, redirect, auto-close, or callback behavior.
Typeform's SDK owns the modal lifecycle, accessibility behavior, and mobile
presentation.

## Error Handling

No custom fallback navigation will be added. If the SDK or form cannot load,
its own error state remains authoritative. This avoids maintaining a second,
potentially inconsistent popup implementation.

## Testing and Verification

Use Node's built-in test runner to server-render the shared adapter with the
real Typeform React component. The regression test will verify that a
configured CTA renders as a button and does not expose an outbound `href`.
The test will be written and observed failing before the adapter is
implemented.

After the focused test passes, run the repository's Prettier check and the
full production build. Inspect the final diff to confirm that all Typeform CTA
consumers use popup configurations while unrelated external links remain
anchors.
