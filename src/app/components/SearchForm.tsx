import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Search, Calendar, Users } from "lucide-react";
import { POPULAR_AIRPORTS } from "./assests/airPorts";

interface SearchFormProps {
  onSearch: (data: SearchData) => void;
}

export interface SearchData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: string;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [origin, setOrigin] = useState("JFK");
  const [destination, setDestination] = useState("LAX");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState("1");

  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [originInput, setOriginInput] = useState("");
  const [destInput, setDestInput] = useState("");

  // Get airport name from code
  const getAirportName = (code: string) => {
    return POPULAR_AIRPORTS.find((a) => a.iataCode === code)?.name || code;
  };

  const filteredOrigins = originInput
    ? POPULAR_AIRPORTS.filter(
        (a) =>
          a.iataCode.includes(originInput.toUpperCase()) ||
          a.name.toLowerCase().includes(originInput.toLowerCase()) ||
          a.cityName.toLowerCase().includes(originInput.toLowerCase()),
      )
    : POPULAR_AIRPORTS;

  const filteredDests = destInput
    ? POPULAR_AIRPORTS.filter(
        (a) =>
          a.iataCode.includes(destInput.toUpperCase()) ||
          a.name.toLowerCase().includes(destInput.toLowerCase()) ||
          a.cityName.toLowerCase().includes(destInput.toLowerCase()),
      )
    : POPULAR_AIRPORTS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) {
      alert("Please select both origin and destination");
      return;
    }
    onSearch({
      origin,
      destination,
      departureDate,
      returnDate: returnDate || undefined,
      adults,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        {/* Origin */}
        <div className="space-y-2 relative">
          <Label htmlFor="origin">From</Label>
          <Input
            id="origin"
            type="text"
            placeholder={originInput ? "" : getAirportName(origin)}
            value={originInput}
            onChange={(e) => {
              setOriginInput(e.target.value);
              setShowOriginDropdown(true);
            }}
            onFocus={() => setShowOriginDropdown(true)}
            onBlur={() => setTimeout(() => setShowOriginDropdown(false), 150)}
            className="placeholder:text-black placeholder:font-medium"
          />
          {showOriginDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 z-20 max-h-56 overflow-y-auto shadow-lg">
              {filteredOrigins.length > 0 ? (
                filteredOrigins.map((airport) => (
                  <button
                    key={airport.iataCode}
                    type="button"
                    onClick={() => {
                      setOrigin(airport.iataCode);
                      setOriginInput("");
                      setShowOriginDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 border-b border-gray-100 last:border-b-0 transition-colors ${
                      origin === airport.iataCode
                        ? "bg-blue-100 hover:bg-blue-100"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <div className="font-semibold text-sm">{airport.name}</div>
                    <div className="text-xs text-gray-600">
                      {airport.cityName}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No airports found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Destination */}
        <div className="space-y-2 relative">
          <Label htmlFor="destination">To</Label>
          <Input
            id="destination"
            type="text"
            placeholder={destInput ? "" : getAirportName(destination)}
            value={destInput}
            onChange={(e) => {
              setDestInput(e.target.value);
              setShowDestDropdown(true);
            }}
            onFocus={() => setShowDestDropdown(true)}
            onBlur={() => setTimeout(() => setShowDestDropdown(false), 150)}
            className="placeholder:text-black placeholder:font-medium"
          />
          {showDestDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 z-20 max-h-56 overflow-y-auto shadow-lg">
              {filteredDests.length > 0 ? (
                filteredDests.map((airport) => (
                  <button
                    key={airport.iataCode}
                    type="button"
                    onClick={() => {
                      setDestination(airport.iataCode);
                      setDestInput("");
                      setShowDestDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 border-b border-gray-100 last:border-b-0 transition-colors ${
                      destination === airport.iataCode
                        ? "bg-blue-100 hover:bg-blue-100"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <div className="font-semibold text-sm">{airport.name}</div>
                    <div className="text-xs text-gray-600">
                      {airport.cityName}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No airports found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div className="space-y-2">
          <Label htmlFor="departure">Depart</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              id="departure"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Return Date */}
        <div className="space-y-2">
          <Label htmlFor="return">Return</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              id="return"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="space-y-2">
          <Label htmlFor="adults">Passengers</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              id="adults"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num.toString()}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          className="w-full h-10 bg-blue-600 hover:bg-blue-700"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
}
