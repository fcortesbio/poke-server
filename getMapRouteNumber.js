function getRouteNumber() {
  const now = new Date();

  // Adjust for Central Time (CT)
  const options = { timeZone: 'America/Chicago' }; 
  const ctHour = now.toLocaleString('en-US', { hour: 'numeric', ...options });

  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)

  // Base route number calculation
  let routeNumber = dayOfWeek * 4;

  // Determine time-based increment using ctHour
  if (ctHour >= 7 && ctHour <= 12) {
    // 7 AM to 12 PM CT
    routeNumber += 1;
  } else if (ctHour >= 13 && ctHour <= 18) {
    // 1 PM to 6 PM CT
    routeNumber += 2;
  } else if (ctHour >= 19) {
    // 7 PM onwards CT
    routeNumber += 3;
  } else {
    routeNumber += 1; // Default for 0-6 AM CT
  }

  // Ensure route number does not exceed 28
  if (routeNumber > 28) {
    routeNumber = 28;
  }

  return routeNumber;
}

module.exports = getRouteNumber;

if (require.main === module) {
  const currentRoute = getRouteNumber();
  console.log("Current route number:", currentRoute);
}