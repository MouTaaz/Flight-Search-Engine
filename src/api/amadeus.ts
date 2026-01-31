import type { Flight } from "../types/flight";

const AMADEUS_BASE_URL = "https://test.api.amadeus.com/v1";
const SHOPPING_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";

let accessToken: string | null = null;
let tokenExpiry = 0;

/**
 * AUTH — browser-side token cache
 */
async function getAccessToken(signal?: AbortSignal) {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) return accessToken;

  const res = await fetch(`${AMADEUS_BASE_URL}/security/oauth2/token`, {
    method: "POST",
    signal,
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
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return accessToken;
}

/**
 * Pure utility, zero side effects
 */
const parseDuration = (d: string) =>
  d.replace("PT", "").replace("H", "h ").replace("M", "m").toLowerCase();

/**
 * MAIN API CALL
 */
export async function searchFlights(
  params: {
    origin: string;
    destination: string;
    date: string;
    adults?: string;
  },
  signal?: AbortSignal,
): Promise<Flight[]> {
  const token = await getAccessToken(signal);

  const url = new URL(SHOPPING_URL);
  Object.entries({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.date,
    adults: params.adults || "1",
    currencyCode: "USD",
    max: "50",
  }).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    signal,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Flight search failed");

  const { data, dictionaries } = await res.json();

  return data.map((offer: any): Flight => {
    const itinerary = offer.itineraries[0];
    const segments = itinerary.segments;

    const first = segments[0];
    const last = segments[segments.length - 1];

    const carrierCode = offer.validatingAirlineCodes[0];
    const airlineName = dictionaries?.carriers?.[carrierCode] || carrierCode;

    const start = new Date(first.departure.at).getTime();
    const end = new Date(last.arrival.at).getTime();

    return {
      id: offer.id,
      airline: airlineName,
      airlineCode: carrierCode,
      origin: first.departure.iataCode,
      destination: last.arrival.iataCode,
      departureTime: new Date(first.departure.at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      arrivalTime: new Date(last.arrival.at).toLocaleTimeString([], {
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
