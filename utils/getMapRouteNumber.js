// In original games, each route defines the roster of possible Pokemon encounters.
// Kanto has a total of 28 different routes. This function is a helper to define the route based on the current time.
// The main server will read this file iteratively to get the current route, and use it to define which pokemon encounters can be generated

function getRouteNumber() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
  const hour = now.getHours(); // 0 to 23

  // Base route number calculation
  let routeNumber = dayOfWeek * 4;

  // Determine time-based increment
  if (hour >= 7 && hour <= 12) {
    // 7 AM to 12 PM
    routeNumber += 1;
  } else if (hour >= 13 && hour <= 18) {
    // 1 PM to 6 PM
    routeNumber += 2;
  } else if (hour >= 19) {
    // 7 PM onwards
    routeNumber += 3;
  } else {
    routeNumber += 1; // Default for 0-6 AM
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
