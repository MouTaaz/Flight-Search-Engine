import { Plane } from "lucide-react";
export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-blue-600" />
          <h1 className="text-gray-900">Flight Search</h1>
        </div>
      </div>
    </header>
  );
}
