const isoTimeFormat = (dateTime) => {
  const date = new Date(dateTime);

  const localTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    // === SỬA DÒNG NÀY ===
    hour12: true, // Đổi từ 'false' thành 'true'
  });

  return localTime;
};

export default isoTimeFormat;
