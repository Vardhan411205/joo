/**
 * Calculate start and end dates based on a time range string
 * @param {string} timeRange - Time range (e.g., '7d', '30d', '90d', '1y')
 * @returns {Object} Object containing startDate and endDate
 */
const calculateDateRange = (timeRange) => {
  const endDate = new Date();
  let startDate = new Date();

  const value = parseInt(timeRange);
  const unit = timeRange.slice(-1);

  switch (unit) {
    case 'd': // days
      startDate.setDate(endDate.getDate() - value);
      break;
    case 'w': // weeks
      startDate.setDate(endDate.getDate() - (value * 7));
      break;
    case 'm': // months
      startDate.setMonth(endDate.getMonth() - value);
      break;
    case 'y': // years
      startDate.setFullYear(endDate.getFullYear() - value);
      break;
    default:
      // Default to 7 days if invalid format
      startDate.setDate(endDate.getDate() - 7);
  }

  // Set start date to beginning of day and end date to end of day
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

module.exports = {
  calculateDateRange
}; 