import type { Flight } from "../../../types/flight";
export function getUniqueAirlines(flights: Flight[]): string[] {
  return Array.from(new Set(flights.map((f) => f.airline))).sort();
}
