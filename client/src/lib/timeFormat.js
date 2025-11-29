const timeFormat = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const minuteReminder = minutes % 60;
  return `${hours}h ${minuteReminder}m`;
};

export default timeFormat;
