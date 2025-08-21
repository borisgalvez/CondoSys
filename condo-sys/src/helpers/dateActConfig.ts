export const dateActConfig = (day: number | null | undefined): string | undefined => {
  if (day === null || day === undefined) {
    return undefined;
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() es 0-indexado

  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");

  return `${year}-${paddedMonth}-${paddedDay}`;
};
