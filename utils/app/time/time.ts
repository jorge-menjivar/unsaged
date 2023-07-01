import { format } from 'date-fns';

// Function to get timestamp with Timezone Offset
export function getTimestampWithTimezoneOffset(): string {
  // Get current date
  const currentDate = new Date();

  // Get timezone offset in minutes
  const timezoneOffset = currentDate.getTimezoneOffset();

  // Convert timezone offset from minutes to milliseconds
  const offsetInMilliseconds = timezoneOffset * 60 * 1000;

  // Subtract the offset in milliseconds to get the UTC date
  const utcDate = new Date(currentDate.getTime() - offsetInMilliseconds);

  // Format date to include timezone offset
  const timestampWithOffset = format(utcDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

  return timestampWithOffset;
}
