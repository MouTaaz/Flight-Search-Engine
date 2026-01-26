import type { Flight } from "../types/flight";

const AMADEUS_BASE_URL = "https://test.api.amadeus.com/v1";
const SHOPPING_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";

let accessToken: string | null = null;
let tokenExpiry: number = 0;

// fetch
async function getAccessToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  const res = await fetch(`${AMADEUS_BASE_URL}/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: import.meta.env.VITE_AMADEUS_API_KEY,
      client_secret: import.meta.env.VITE_AMADEUS_API_SECRET,
    }),
  });

  if (!res.ok) throw new Error("Authentication failed");

  const data = await res.json();
  accessToken = data.access_token;
  // Set expiry with a 60-second buffer
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken;
}

/**
 * Helper to parse PT12H51M format into "12h 51m"
 */
const parseDuration = (d: string) =>
  d.replace("PT", "").replace("H", "h ").replace("M", "m").toLowerCase();

/**
 * Main Search Function
 */
export async function searchFlights(params: {
  origin: string;
  destination: string;
  date: string;
  adults?: string;
}): Promise<Flight[]> {
  const token = await getAccessToken();
  const url = new URL(SHOPPING_URL);

  const searchParams = {
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.date,
    adults: params.adults || "1",
    currencyCode: "USD",
    max: "50",
  };

  Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Flight search failed");

  const { data, dictionaries } = await res.json();

  // Mapping logic that respects multi-segment journeys
  return data.map((offer: any): Flight => {
    const itinerary = offer.itineraries[0];
    const segments = itinerary.segments;

    const departureSegment = segments[0];
    const arrivalSegment = segments[segments.length - 1];

    const carrierCode = offer.validatingAirlineCodes[0];
    const airlineName = dictionaries?.carriers?.[carrierCode] || carrierCode;

    const start = new Date(departureSegment.departure.at).getTime();
    const end = new Date(arrivalSegment.arrival.at).getTime();

    return {
      id: offer.id,
      airline: airlineName,
      airlineCode: carrierCode,
      origin: departureSegment.departure.iataCode,
      destination: arrivalSegment.arrival.iataCode,
      departureTime: new Date(departureSegment.departure.at).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
      arrivalTime: new Date(arrivalSegment.arrival.at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: parseDuration(itinerary.duration),
      durationMinutes: Math.floor((end - start) / 60000),
      stops: segments.length - 1,
      price: parseFloat(offer.price.grandTotal),
    };
  });
}
