/* "400+ Fests." rolled up from "300+": the headline split into the digits
   that change, each with the digit it rolls up from, and the plain text
   either side, for the homepage hero's counter wheel
   (components/FestMapHero). The digits turn one at a time, left to
   right, so each carries its turn (0 first): 300+ reads 400+ before it
   reads 450+. Only a count of the same shape rolls, so a from that is
   missing or that lines up badly (900+ to 1,000+) leaves the headline as
   plain text. */
export const countRoll = (text, from) => {
  const count = /^\d[\d,]*\+?/.exec(text)?.[0];
  if (!count || typeof from !== 'string' || from.length !== count.length) {
    return [{ text }];
  }

  const parts = [];
  let turn = 0;
  [...count].forEach((char, i) => {
    if (char !== from[i]) {
      parts.push({ text: char, from: from[i], turn: turn++ });
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
