import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";

export interface FilterState {
  priceRange: [number, number];
  stops: number[];
  airlines: string[];
}

interface FlightFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableAirlines: string[];
  minPrice: number;
  maxPrice: number;
}

export function FlightFilters({
  filters,
  onFiltersChange,
  availableAirlines,
  minPrice,
  maxPrice,
}: FlightFiltersProps) {
  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const handleStopsToggle = (stopCount: number) => {
    const newStops = filters.stops.includes(stopCount)
      ? filters.stops.filter((s) => s !== stopCount)
      : [...filters.stops, stopCount];
    onFiltersChange({
      ...filters,
      stops: newStops,
    });
  };

  const handleAirlineToggle = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline];
    onFiltersChange({
      ...filters,
      airlines: newAirlines,
    });
  };

  return (
    <div className="space-y-6 px-4 md:px-0">
      <div>
        <h3 className="mb-4 font-semibold">Filters</h3>
        <Separator />
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm">Price Range</Label>
          <div className="text-sm text-gray-600 mt-1">
            USD {filters.priceRange[0]} - USD {filters.priceRange[1]}
          </div>
        </div>
        <Slider
          min={minPrice}
          max={maxPrice}
          step={10}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-gray-400 uppercase">
          <span>Min: USD {minPrice}</span>
          <span>Max: USD {maxPrice}</span>
        </div>
      </div>

      <Separator />

      {/* Stops Filter */}
      <div className="space-y-3">
        <Label className="text-sm">Number of Stops</Label>
        <div className="space-y-2">
          {[
            { id: 0, label: "Non-stop" },
            { id: 1, label: "1 Stop" },
            { id: 2, label: "2+ Stops" },
          ].map((stop) => (
            <div key={stop.id} className="flex items-center space-x-2">
              <Checkbox
                id={`stops-${stop.id}`}
                checked={filters.stops.includes(stop.id)}
                onCheckedChange={() => handleStopsToggle(stop.id)}
              />
              <label
                htmlFor={`stops-${stop.id}`}
                className="text-sm cursor-pointer select-none"
              >
                {stop.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Airlines Filter */}
      <div className="space-y-3">
        <Label className="text-sm">Airlines</Label>
        {availableAirlines.length === 0 ? (
          <p className="text-xs text-gray-500">No airlines available</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {availableAirlines.map((airline) => (
              <div key={airline} className="flex items-center space-x-2">
                <Checkbox
                  id={`airline-${airline}`}
                  checked={filters.airlines.includes(airline)}
                  onCheckedChange={() => handleAirlineToggle(airline)}
                />
                <label
                  htmlFor={`airline-${airline}`}
                  className="text-sm cursor-pointer select-none"
                >
                  {airline}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
