import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { SlidersHorizontal } from "lucide-react";
import { FlightFilters, FilterState } from "./FlightFilters";

interface FiltersPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableAirlines: string[];
  minPrice: number;
  maxPrice: number;
}

export function FiltersPanel({
  filters,
  onFiltersChange,
  availableAirlines,
  minPrice,
  maxPrice,
}: FiltersPanelProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Desktop
  return (
    <>
      <aside className="hidden lg:block w-64">
        <div className="bg-white p-6 rounded-lg border sticky top-6">
          <FlightFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            availableAirlines={availableAirlines}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </div>
      </aside>
      {/* Mobile */}
      <div className="lg:hidden mb-4">
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FlightFilters
                filters={filters}
                onFiltersChange={onFiltersChange}
                availableAirlines={availableAirlines}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
