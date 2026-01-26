export type Flight = {
  id: string;
  airline: string;
  airlineCode: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  stops: number;
  price: number;
};

export interface AmadeusFlightOffer {
  id: string;
  price: {
    total: string;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: { at: string; iataCode: string };
      arrival: { at: string; iataCode: string };
      carrierCode: string;
      numberOfStops: number;
    }>;
  }>;
}

export interface AmadeusResponse {
  data: AmadeusFlightOffer[];
  dictionaries: {
    carriers: Record<string, string>;
  };
}
