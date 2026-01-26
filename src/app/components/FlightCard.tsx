import { Plane } from "lucide-react";
import { Button } from "../components/ui/button";
import type { Flight } from "../../types/flight";
import { POPULAR_AIRPORTS } from "./assests/airPorts";

interface FlightCardProps {
  flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
  // Logic to find full airport names based on IATA codes
  const getAirportName = (iataCode: string) => {
    const airport = POPULAR_AIRPORTS.find((a) => a.iataCode === iataCode);
    return airport ? airport.name : iataCode;
  };

  const originAirportName = getAirportName(flight.origin);
  const destinationAirportName = getAirportName(flight.destination);

  const getStopsText = () => {
    if (flight.stops === 0) return "Non-stop";
    if (flight.stops === 1) return "1 Stop";
    return `${flight.stops} Stops`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Airline Info */}
        <div className="flex items-center gap-3 min-w-[140px]">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Plane className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-900">{flight.airline}</div>
            <div className="text-xs text-gray-500">{flight.airlineCode}</div>
          </div>
        </div>

        {/* Flight Times & Airports */}
        <div className="flex items-center gap-6 flex-1">
          <div className="text-center">
            <div className="text-xl text-gray-900 font-medium">
              {flight.departureTime}
            </div>
            {/* Updated to show full name from assets */}
            <div className="text-sm text-gray-500">{originAirportName}</div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1 min-w-[120px]">
            <div className="text-xs text-gray-500">{flight.duration}</div>
            <div className="w-full h-px bg-gray-300 relative">
              <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 bg-white" />
            </div>
            <div className="text-xs text-gray-500">{getStopsText()}</div>
          </div>

          <div className="text-center">
            <div className="text-xl text-gray-900 font-medium">
              {flight.arrivalTime}
            </div>
            {/* Updated to show full name from assets */}
            <div className="text-sm text-gray-500">
              {destinationAirportName}
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center gap-4 lg:ml-6">
          <div className="text-right">
            <div className="text-2xl text-gray-900 font-semibold">
              ${flight.price}
            </div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
            Select
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FlightCard;
