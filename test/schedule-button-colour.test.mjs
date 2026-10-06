import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

/* iOS Safari paints <button> text -apple-system-blue unless the page sets a
   colour of its own (WebKit's html.css, for `button` and `button:active`
   alike). Desktop browsers default to ButtonText, which is black and close
   enough to ink that a missing colour never shows there. On an iPhone it
   turned every row of /schedule blue (2026-10-06).

   Buttons do not inherit colour from their parent the way a span would, so
   every class a /schedule <button> carries has to set `color` itself. The
   one exception is .hf-button, which sets it in src/styles/buttons.css. */

const DIR = new URL('../src/components/ScheduleDirectory/', import.meta.url);

const read = (name) => readFile(new URL(name, DIR), 'utf8');

/* Every styles.<name> found in the className of a <button> opening tag,
   skipping the .hf-button ones. */
const buttonClasses = (source) =>
  [...source.matchAll(/<button\b[^>]*?className=\{([^}]*)\}/gs)]
    .filter(([, expression]) => !expression.includes('hf-button'))
    .flatMap(([, expression]) =>
      [...expression.matchAll(/styles\.(\w+)/g)].map(([, name]) => name),
    );

/* The declarations of every rule whose selector list includes `.name` on its
   own, at the top level or inside an @media block. */
const declarationsFor = (css, name) =>
  [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selectors]) =>
      selectors.split(',').some((selector) => selector.trim() === `.${name}`),
    )
    .map(([, , body]) => body);

test('every /schedule button sets its own text colour', async () => {
  const files = (await readdir(DIR)).filter((name) => name.endsWith('.js'));
  const sources = await Promise.all(files.map(read));
  const css = await read('ScheduleDirectory.module.css');

  const classes = [...new Set(sources.flatMap(buttonClasses))];
  assert.ok(
    classes.includes('sessionRow'),
    'found no button classes; the scan is broken',
  );

  classes.forEach((name) => {
    assert.ok(
      declarationsFor(css, name).some((body) =>
        /(^|[;\s])color\s*:/.test(body),
      ),
      `.${name} styles a <button> but sets no color, so iOS Safari paints it blue`,
    );
  });
});
