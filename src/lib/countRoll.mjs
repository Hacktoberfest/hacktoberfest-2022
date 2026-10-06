/* "500+ Fests." rolled up from "300+": the headline split into the digits
   that change and the plain text either side, for the homepage hero's
   counter wheel (components/FestMapHero). Each changed digit carries the
   digit it rolls up from, the digits it passes on the way (via), and the
   turn its wheel starts on (0 first). A wheel takes one turn for every
   digit it moves, and the wheels turn one at a time from the left, so
   300+ reads 400+ before it reads 500+. rollFrom is a round count and
   counts only grow, so every number on the way is a real one. Only a
   count of the same shape rolls, so a from that is missing or that lines
   up badly (900+ to 1,000+) leaves the headline as plain text. */
export const countRoll = (text, from) => {
  const count = /^\d[\d,]*\+?/.exec(text)?.[0];
  if (!count || typeof from !== 'string' || from.length !== count.length) {
    return [{ text }];
  }

  const parts = [];
  let turn = 0;
  [...count].forEach((char, i) => {
    if (char !== from[i]) {
      const via = between(from[i], char);
      parts.push({ text: char, from: from[i], via, turn });
      turn += via.length + 1;
      return;
    }
    const last = parts[parts.length - 1];
    if (last && !last.from) last.text += char;
    else parts.push({ text: char });
  });

  /* Nothing changed: no wheel to turn. */
  if (!parts.some((part) => part.from)) return [{ text }];

  const rest = text.slice(count.length);
  const last = parts[parts.length - 1];
  if (rest && !last.from) last.text += rest;
  else if (rest) parts.push({ text: rest });
  return parts;
};

/* The digits a wheel shows on its way up from one digit to another: 4 on
   the way from 3 to 5, none from 3 to 4. Anything but two digits swaps
   straight over. */
const between = (from, to) => {
  if (!/\d/.test(from) || !/\d/.test(to)) return [];
  const steps = (Number(to) - Number(from) + 10) % 10;
  return Array.from({ length: steps - 1 }, (_, i) =>
    String((Number(from) + i + 1) % 10),
  );
};
