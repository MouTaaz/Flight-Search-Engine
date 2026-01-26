import { useState, useEffect } from "react";
import { Flight } from "../../types/flight";
import { SearchData } from "../components/SearchForm";
import { searchFlights } from "../../api/amadeus";

export function useFlights(searchData: SearchData | null) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchData) {
      setFlights([]);
      return;
    }

    const fetchFlights = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await searchFlights({
          origin: searchData.origin,
          destination: searchData.destination,
          date: searchData.departureDate,
          adults: searchData.adults,
        });

        setFlights(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Flight search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchData]);

  return { flights, loading, error };
}
