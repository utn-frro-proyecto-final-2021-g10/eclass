export const parseDate: (date: Date) => string = (date: Date) =>
  new Date(date).toLocaleString("es", {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
