import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import { brand } from '../src/data/content.mjs';
import { absoluteUrl } from '../src/data/meta.js';

/* /brand's own concerns, in the shape host-page.test.mjs established: the
   page exports, is indexable, carries its canonical URL, and — the part
   that is particular to this page — every logo tile links a file that is
   actually in the export. A download link to a missing SVG is the one
   failure a visitor cannot work around. */

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const outputExists = (path) =>
  access(new URL(`../out/${path}`, import.meta.url)).then(
    () => true,
    () => false,
  );

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// React escapes text content on the way to static HTML.
const rendered = (text) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

test('/brand builds with its title and hero copy', async () => {
  const html = await readOutput('brand/index.html');
  assert.match(
    html,
    new RegExp(`<title[^>]*>${escapeRegExp(brand.title)}</title>`),
  );
  assert.ok(html.includes(brand.eyebrow));
  assert.ok(html.includes(rendered(brand.intro)));
});

test('/brand is indexable and carries its canonical URL', async () => {
  const html = await readOutput('brand/index.html');
  assert.match(html, /<meta name="robots" content="index, follow"/);
  assert.match(
    html,
    new RegExp(
      `<link rel="canonical" href="${escapeRegExp(absoluteUrl('/brand/'))}"`,
    ),
  );
});

test('/brand lists every swatch with its hex', async () => {
  const html = await readOutput('brand/index.html');
  brand.colors.swatches.forEach((swatch) => {
    assert.ok(html.includes(swatch.hex), `missing hex: ${swatch.id}`);
    assert.ok(
      html.includes(rendered(swatch.role)),
      `missing role: ${swatch.id}`,
    );
  });
});

test('/brand links every font family to Google Fonts', async () => {
  const html = await readOutput('brand/index.html');
  brand.type.families.forEach((family) => {
    assert.match(
      html,
      new RegExp(`<a[^>]*href="${escapeRegExp(family.url)}"[^>]*>`),
      `missing font link: ${family.id}`,
    );
  });
});

test('/brand offers every mark in every colorway, and each file is in the export', async () => {
  const html = await readOutput('brand/index.html');
  for (const mark of brand.logos.marks) {
    for (const colorway of brand.logos.colorways) {
      const file = `/brand/logos/${mark.file}-${colorway.id}.svg`;
      assert.match(
        html,
        new RegExp(`<a[^>]*href="${escapeRegExp(file)}"[^>]*download`),
        `missing download link: ${file}`,
      );
      assert.ok(await outputExists(file.slice(1)), `missing file: ${file}`);
    }
  }
});

test('the logo files are drawn in the colorway their name claims', async () => {
  for (const mark of brand.logos.marks) {
    const forest = await readOutput(`brand/logos/${mark.file}-forest.svg`);
    const ink = await readOutput(`brand/logos/${mark.file}-ink.svg`);
    const white = await readOutput(`brand/logos/${mark.file}-white.svg`);
    assert.ok(forest.includes('fill="#3D5F58"'), `${mark.id} forest`);
    assert.ok(!forest.includes('fill="#231F20"'), `${mark.id} forest has ink`);
    assert.ok(ink.includes('fill="#231F20"'), `${mark.id} ink`);
    assert.ok(white.includes('fill="white"'), `${mark.id} white`);
  }
});

test("/brand offers every partner logo as sourced, and links each partner's guidelines", async () => {
  const html = await readOutput('brand/index.html');
  for (const partner of brand.partners.list) {
    assert.match(
      html,
      new RegExp(
        `<a[^>]*href="${escapeRegExp(partner.guidelines.href)}"[^>]*>`,
      ),
      `missing guidelines link: ${partner.id}`,
    );
    for (const variant of partner.variants) {
      const ext = variant.ext || 'svg';
      const file = `${partner.path}/${variant.file}.${ext}`;
      assert.match(
        html,
        new RegExp(`<a[^>]*href="${escapeRegExp(file)}"[^>]*download`),
        `missing download link: ${file}`,
      );
      assert.ok(await outputExists(file.slice(1)), `missing file: ${file}`);
      // Never recoloured: a partner's file carries the partner's colours
      // and no Hacktoberfest forest anywhere in it. Only checkable on the
      // vector files; a PNG is bytes.
      if (ext === 'svg') {
        const svg = await readOutput(file.slice(1));
        assert.ok(!/#3d5f58/i.test(svg), `${file} was recoloured forest`);
      }
    }
  }
  const mlhColor = await readOutput('brand/logos/partners/mlh-logo-color.svg');
  assert.ok(
    mlhColor.includes('#1d539f'),
    'MLH blue is gone from the color logo',
  );
});

test("/brand carries the do and don't lists", async () => {
  const html = await readOutput('brand/index.html');
  [...brand.rules.dos.items, ...brand.rules.donts.items].forEach((item) => {
    assert.ok(html.includes(rendered(item)), `missing rule: ${item}`);
  });
});

test('the build artifacts know about /brand', async () => {
  const [sitemapXml, llmsIndex, llmsFull] = await Promise.all([
    readOutput('sitemap.xml'),
    readOutput('llms.txt'),
    readOutput('llms-full.txt'),
  ]);
  assert.ok(sitemapXml.includes('/brand/'), 'sitemap misses /brand/');
  assert.ok(llmsIndex.includes('./brand/'), 'llms.txt misses /brand/');
  brand.colors.swatches.forEach((swatch) => {
    assert.ok(
      llmsFull.includes(swatch.hex),
      `llms-full.txt misses ${swatch.id}`,
    );
  });
  brand.type.families.forEach((family) => {
    assert.ok(
      llmsFull.includes(family.name),
      `llms-full.txt misses ${family.id}`,
    );
  });
});
