export const getStartDateEndDate = (month?: string): { start: Date; end: Date } => {
  let start: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  if (month) {
    start = new Date(`${month}-01T00:00:00.000Z`);
  }
  const end = new Date(start);
  end.setMonth(start.getMonth() + 1);
  return { start, end };
}