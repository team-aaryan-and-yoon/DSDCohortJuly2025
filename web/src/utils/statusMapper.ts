import type { Status } from "@/types/enums";

/**
 * Status mapping constants
 *
 * These maps define the official format translations between backend and frontend.
 * Add any new statuses here as they are introduced.
 */
const BACKEND_TO_FRONTEND: Record<string, Status> = {
  scheduled: "Scheduled",
  "on-the-way": "On the way",
  "in-progress": "In progress",
  completed: "Completed",
};

const FRONTEND_TO_BACKEND: Record<string, string> = {
  Scheduled: "scheduled",
  "On the way": "on-the-way",
  "In progress": "in-progress",
  Completed: "completed",
};

/**
 * Normalizes a status string for comparison
 */
const normalizeStatus = (status: string): string => {
  return status.toLowerCase().trim();
};

/**
 * Maps a backend status to frontend Status enum
 *
 * This function is robust against various formats that might come from the backend,
 * including inconsistent capitalization or formatting.
 *
 * @param backendStatus - The status string from the backend
 * @returns A properly formatted frontend Status enum value
 */
export const mapBackendToFrontendStatus = (backendStatus: string): Status => {
  // Handle null/undefined case
  if (!backendStatus) {
    console.warn("Received empty status, defaulting to Scheduled");
    return "Scheduled";
  }

  // Check direct match first (fastest path)
  if (BACKEND_TO_FRONTEND[backendStatus]) {
    return BACKEND_TO_FRONTEND[backendStatus];
  }

  // Normalize and try again
  const normalized = normalizeStatus(backendStatus);

  // Try with different formats
  const withDashes = normalized.replace(/\s+/g, "-");
  const withSpaces = normalized.replace(/-/g, " ");

  if (BACKEND_TO_FRONTEND[withDashes]) {
    return BACKEND_TO_FRONTEND[withDashes];
  }

  if (BACKEND_TO_FRONTEND[withSpaces]) {
    return BACKEND_TO_FRONTEND[withSpaces];
  }

  // Look for case-insensitive match in values
  const frontendValues = Object.values(BACKEND_TO_FRONTEND);
  const match = frontendValues.find(
    (value) =>
      normalizeStatus(value) === normalized ||
      normalizeStatus(value) === withSpaces
  );

  if (match) {
    return match;
  }

  // Log a warning for debugging
  console.warn(
    `Unknown status received: ${backendStatus}, defaulting to Scheduled`
  );

  // Default fallback
  return "Scheduled";
};

/**
 * Maps a frontend Status to backend format
 *
 * @param frontendStatus - The Status enum value from the frontend
 * @returns The properly formatted string for the backend API
 */
export const mapFrontendToBackendStatus = (frontendStatus: Status): string => {
  const backendStatus = FRONTEND_TO_BACKEND[frontendStatus];

  if (!backendStatus) {
    console.warn(
      `Unknown frontend status: ${frontendStatus}, defaulting to 'scheduled'`
    );
    return "scheduled";
  }

  return backendStatus;
};
