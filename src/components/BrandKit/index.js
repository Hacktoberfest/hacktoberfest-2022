import { useEffect, useState } from 'react';

import { brand } from 'data/content.mjs';

import styles from './BrandKit.module.css';

/* The /brand page body: the palette, the type system, the logos, and a
   short list of rules, all read from data/content.mjs so llms-full.txt
   says the same thing the page does.

   CSS Module rather than styled-components, for the reason PageHero and
   FaqDirectory give: an interior page reached by client-side navigation
   ships no styled-components CSS, and a brand page with no styles is a
   page of hex codes in Times.

   The logo files are static SVGs under public/brand/logos/, one per mark
   and colorway, and the tiles below show the very file the link
   downloads: an <img> of it, on the ground its colorway is meant for. No
   inline copy of the artwork to drift from the download. */

const LOGO_PATH = '/brand/logos';

const logoFile = (mark, colorway) =>
  `${LOGO_PATH}/${mark.file}-${colorway.id}.svg`;

const SectionHeading = ({ eyebrow, heading, intro, id }) => (
  <header className={styles.sectionHead}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <h2 id={id} className={styles.heading}>
      {heading.lead} <em>{heading.accent}</em>
    </h2>
    {intro && <p className={styles.intro}>{intro}</p>}
  </header>
);

/* A swatch is a button so the hex is one click away. The clipboard call
   can refuse (an insecure origin, a denied permission), and the fallback
   is the hex being right there on the tile to select by hand, so a
   failure changes nothing visible. */
const Swatch = ({ swatch }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(swatch.hex);
      setCopied(true);
    } catch (_) {
      /* Nothing to do: the hex is printed on the tile. */
    }
  };

  return (
    <li className={styles.swatch}>
      <button
        type="button"
        className={styles.swatchButton}
        style={{ '--swatch': swatch.hex }}
        data-dark={swatch.dark ? 'true' : 'false'}
        onClick={copy}
        aria-label={`Copy ${swatch.name} ${swatch.hex}`}
      >
        <span className={styles.swatchName}>{swatch.name}</span>
        <span className={styles.swatchHex} aria-live="polite">
          {copied ? brand.colors.copied : swatch.hex}
        </span>
      </button>
      <p className={styles.swatchRole}>{swatch.role}</p>
    </li>
  );
};

const Colors = () => (
  <section className={styles.section} aria-labelledby="brand-colors">
    <SectionHeading
      id="brand-colors"
      eyebrow={brand.colors.eyebrow}
      heading={brand.colors.heading}
      intro={brand.colors.intro}
    />
    <p className={styles.hint}>{brand.colors.copyHint}</p>
    <ul className={styles.swatches}>
      {brand.colors.swatches.map((swatch) => (
        <Swatch key={swatch.id} swatch={swatch} />
      ))}
    </ul>
  </section>
);

const Fonts = () => (
  <section className={styles.section} aria-labelledby="brand-fonts">
    <SectionHeading
      id="brand-fonts"
      eyebrow={brand.type.eyebrow}
      heading={brand.type.heading}
      intro={brand.type.intro}
    />
    <ul className={styles.families}>
      {brand.type.families.map((family) => (
        <li key={family.id} className={styles.family}>
          <p className={styles.familyRole}>{family.role}</p>
          <p className={styles.specimen} data-family={family.id}>
            {family.specimen}
          </p>
          <h3 className={styles.familyName}>{family.name}</h3>
          <p className={styles.familyUse}>{family.use}</p>
          <p className={styles.familyWeights}>{family.weights}</p>
          <a
            className={styles.link}
            href={family.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get {family.name} on Google Fonts
          </a>
        </li>
      ))}
    </ul>
    <div className={styles.embed}>
      <p className={styles.embedLabel}>{brand.type.embed.label}</p>
      <code className={styles.embedCode}>{brand.type.embed.href}</code>
    </div>
  </section>
);

const Logos = () => (
  <section className={styles.section} aria-labelledby="brand-logos">
    <SectionHeading
      id="brand-logos"
      eyebrow={brand.logos.eyebrow}
      heading={brand.logos.heading}
      intro={brand.logos.intro}
    />
    {brand.logos.marks.map((mark) => (
      <div key={mark.id} className={styles.mark}>
        <div className={styles.markHead}>
          <h3 className={styles.markName}>{mark.name}</h3>
          <p className={styles.markUse}>{mark.use}</p>
        </div>
        <ul className={styles.tiles}>
          {brand.logos.colorways.map((colorway) => {
            const file = logoFile(mark, colorway);
            const recommended = colorway.id === 'forest';
            return (
              <li
                key={colorway.id}
                className={styles.tile}
                data-ground={colorway.ground}
              >
                <div
                  className={styles.tileArt}
                  style={{ '--ratio': mark.ratio }}
                >
                  <img
                    src={file}
                    alt={`${mark.name}, ${colorway.name.toLowerCase()}`}
                    loading="lazy"
                  />
                </div>
                <div className={styles.tileFoot}>
                  <span className={styles.tileName}>
                    {colorway.name}
                    {recommended && (
                      <span className={styles.badge}>
                        {brand.logos.recommended}
                      </span>
                    )}
                  </span>
                  <a className={styles.download} href={file} download>
                    {brand.logos.download}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </section>
);

/* Each partner's logo in the versions the partner publishes, each tile
   the file its link downloads, same as the Hacktoberfest tiles above. No
   forest colorway and no recommended badge: these colours are theirs. */
const Partners = () => (
  <section className={styles.section} aria-labelledby="brand-partners">
    <SectionHeading
      id="brand-partners"
      eyebrow={brand.partners.eyebrow}
      heading={brand.partners.heading}
      intro={brand.partners.intro}
    />
    {brand.partners.list.map((partner) => (
      <div key={partner.id} className={styles.mark}>
        <div className={styles.markHead}>
          <h3 className={styles.markName}>{partner.name}</h3>
          <p className={styles.markUse}>
            {partner.note}{' '}
            <a
              className={styles.link}
              href={partner.guidelines.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {partner.guidelines.label}
            </a>
          </p>
        </div>
        <ul className={styles.tiles} data-columns={partner.variants.length}>
          {partner.variants.map((variant) => {
            const ext = variant.ext || 'svg';
            const file = `${partner.path}/${variant.file}.${ext}`;
            return (
              <li
                key={variant.id}
                className={styles.tile}
                data-ground={variant.ground}
              >
                <div
                  className={styles.tileArt}
                  style={{ '--ratio': partner.ratio }}
                >
                  <img
                    src={file}
                    alt={`${partner.name}, ${variant.name.toLowerCase()}`}
                    loading="lazy"
                  />
                </div>
                <div className={styles.tileFoot}>
                  <span className={styles.tileName}>{variant.name}</span>
                  <a className={styles.download} href={file} download>
                    {brand.partners.download[ext]}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </section>
);

/* The Limitations pages of the guidelines: a paragraph on what the brand
   is for, then Do and Don't side by side, the way the deck lays them
   out. */
const Rules = () => (
  <section className={styles.section} aria-labelledby="brand-rules">
    <SectionHeading
      id="brand-rules"
      eyebrow={brand.rules.eyebrow}
      heading={brand.rules.heading}
      intro={brand.rules.intro}
    />
    <div className={styles.rulesColumns}>
      {[brand.rules.dos, brand.rules.donts].map((column, index) => (
        <div
          key={column.title}
          className={styles.rulesColumn}
          data-kind={index === 0 ? 'do' : 'dont'}
        >
          <h3 className={styles.rulesTitle}>{column.title}</h3>
          <ul className={styles.rules}>
            {column.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

const BrandKit = () => (
  <div className={styles.root}>
    <Colors />
    <Fonts />
    <Logos />
    <Partners />
    <Rules />
  </div>
);

export default BrandKit;
