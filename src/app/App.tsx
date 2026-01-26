import { useState, useMemo } from "react";
import { SearchForm, SearchData } from "./components/SearchForm";
import { FlightResults } from "./components/FlightResults";
import { PriceGraph } from "./components/PriceGraph";
import { useFlights } from "./hooks/useFlights";
import { FilterState } from "./components/FlightFilters";
import { getUniqueAirlines } from "./components/assests/uniqueAirlines";
import { filterAndSortFlights } from "./components/assests/flightsFiltering";
import { FiltersPanel } from "./components/FiltersPanel";
import { Header } from "./components/Header";

export default function App() {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "duration">("price");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    stops: [0, 1, 2],
    airlines: [],
  });

  const { flights, loading, error } = useFlights(searchData);

  const filteredAndSortedFlights = useMemo(
    () => filterAndSortFlights(flights, filters, sortBy),
    [flights, filters, sortBy],
  );

  const minPrice =
    flights.length > 0 ? Math.min(...flights.map((f) => f.price)) : 0;
  const maxPrice =
    flights.length > 0 ? Math.max(...flights.map((f) => f.price)) : 5000;
  const availableAirlines = getUniqueAirlines(flights);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <SearchForm onSearch={setSearchData} />
        <div className="flex flex-col lg:flex-row gap-6">
          <FiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            availableAirlines={availableAirlines}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
          <div className="flex-1 space-y-6">
            {loading && <div>Loading flights…</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && filteredAndSortedFlights.length === 0 && (
              <div>No flights found. Try different dates or filters.</div>
            )}
            {!loading && !error && filteredAndSortedFlights.length > 0 && (
              <>
                <PriceGraph flights={filteredAndSortedFlights} />
                <FlightResults
                  flights={filteredAndSortedFlights}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
