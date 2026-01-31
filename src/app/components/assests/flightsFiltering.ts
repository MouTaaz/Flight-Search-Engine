import type { Flight } from "../../../types/flight";
import { FilterState } from "../../components/FlightFilters";

export function filterAndSortFlights(
  flights: Flight[],
  filters: FilterState,
  sortBy: "price" | "duration",
): Flight[] {
  let result: Flight[] = flights.slice();

  result = result.filter(
    (flight) =>
      flight.price >= filters.priceRange[0] &&
      flight.price <= filters.priceRange[1],
  );
  if (filters.stops.length > 0) {
    result = result.filter((flight) =>
      filters.stops.includes(2) && flight.stops >= 2
        ? true
        : filters.stops.includes(flight.stops),
    );
  }
  if (filters.airlines.length > 0) {
    result = result.filter((flight) =>
      filters.airlines.includes(flight.airline),
    );
  }
  result.sort((a, b) =>
    sortBy === "price"
      ? a.price - b.price
      : a.durationMinutes - b.durationMinutes,
  );
  return result;
}
