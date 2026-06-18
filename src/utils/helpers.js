// Format date to readable string (e.g. 15 Mar 2026)
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Format time to 12-hour format (e.g. 09:00 AM)
export const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Calculate duration string (e.g. 5h 30m)
export const formatDuration = (hoursFloat) => {
  if (!hoursFloat) return "0h 0m";
  const hours = Math.floor(hoursFloat);
  const minutes = Math.round((hoursFloat - hours) * 60);
  return `${hours}h ${minutes}m`;
};

// Parse an object to query string for URLs
export const objectToQueryString = (obj) => {
  const params = new URLSearchParams();
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      params.append(key, obj[key]);
    }
  });
  return params.toString();
};
