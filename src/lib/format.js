export const withOrdinal = value => {
  const i = value % 10;
  const j = value % 100;

  if (i === 1 && j !== 11) return `${value}st`;
  if (i === 2 && j !== 12) return `${value}nd`;
  if (i === 3 && j !== 13) return `${value}rd`;
  return `${value}th`;
};
