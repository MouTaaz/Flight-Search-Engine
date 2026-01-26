import { FlightCard } from "../components/FlightCard";
import type { Flight } from "../../types/flight";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface FlightResultsProps {
  flights: Flight[];
  sortBy: "price" | "duration";
  onSortChange: (sort: "price" | "duration") => void;
}

export function FlightResults({
  flights,
  sortBy,
  onSortChange,
}: FlightResultsProps) {
  return (
    <div className="space-y-4">
      {/* Header with sort */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Available Flights</h2>
          <p className="text-sm text-gray-500 mt-1">
            {flights.length} flights found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <Select
            value={sortBy}
            onValueChange={(value) =>
              onSortChange(value as "price" | "duration")
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="duration">Duration: Shortest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-3">
        {flights.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No flights match your criteria</p>
          </div>
        ) : (
          flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))
        )}
      </div>
    </div>
  );
}
