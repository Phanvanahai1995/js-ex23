export function formattedDate(date) {
  const dated = new Date(date).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
  });

  return dated;
}
