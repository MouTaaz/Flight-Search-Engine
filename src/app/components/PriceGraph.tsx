import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Flight } from "../../types/flight";

interface PriceGraphProps {
  flights: Flight[];
}

export function PriceGraph({ flights }: PriceGraphProps) {
  // Dynamically calculate price ranges based on flight data
  const getPriceRanges = () => {
    if (flights.length === 0) {
      return [
        { range: "$0-$300", min: 0, max: 300 },
        { range: "$300-$500", min: 300, max: 500 },
        { range: "$500-$700", min: 500, max: 700 },
        { range: "$700-$1000", min: 700, max: 1000 },
        { range: "$1000+", min: 1000, max: Infinity },
      ];
    }

    const minPrice = Math.min(...flights.map((f) => f.price));
    const maxPrice = Math.max(...flights.map((f) => f.price));
    const priceRange = maxPrice - minPrice;
    const step = Math.ceil(priceRange / 5 / 50) * 50; // Round to nearest 50

    const ranges = [];
    let currentMin = Math.floor(minPrice / step) * step;

    for (let i = 0; i < 5; i++) {
      const min = currentMin + i * step;
      const max = currentMin + (i + 1) * step;
      ranges.push({
        range: `$${min}-$${max}`,
        min,
        max,
      });
    }

    // Add final "over max" range
    ranges.push({
      range: `$${currentMin + 5 * step}+`,
      min: currentMin + 5 * step,
      max: Infinity,
    });

    return ranges;
  };

  const priceRanges = getPriceRanges();

  const data = priceRanges
    .map(({ range, min, max }) => ({
      range,
      count: flights.filter((f) => f.price >= min && f.price < max).length,
    }))
    .filter((item) => item.count > 0); // Only show ranges with flights

  // Handle empty state
  if (flights.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-gray-900 font-semibold">Price Distribution</h3>
          <p className="text-sm text-gray-500 mt-1">
            Number of flights by price range
          </p>
        </div>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No flight data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-gray-900 font-semibold">Price Distribution</h3>
        <p className="text-sm text-gray-500 mt-1">
          {flights.length} flights found
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="range"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
            cursor={{ fill: "#f3f4f6" }}
            formatter={(value) => [
              `${value} flight${value !== 1 ? "s" : ""}`,
              "Count",
            ]}
          />
          <Bar
            dataKey="count"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            name="Flights"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
