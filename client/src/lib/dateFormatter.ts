export const formatMessageTime = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
  
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
  
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true, 
      timeZone: "Asia/Kolkata", // Ensure IST timezone
    };
  
    if (isToday) {
      return date.toLocaleTimeString("en-IN", timeOptions); 
    } else if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString("en-IN", timeOptions)}`;
    } else {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + ` at ${date.toLocaleTimeString("en-IN", timeOptions)}`;
    }
  };
  