import "./globals.css";
import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation"; // Import the new Client Component

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div
          className="max-w-md mx-auto h-[844px] bg-gray-900 rounded-[60px] overflow-hidden border-[14px] border-gray-800 relative shadow-xl"
          style={{
            backgroundImage: "url('/images/BG4.png')", // Update path to your background image
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Top aesthetic bar */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[30px] bg-gray-800 rounded-b-3xl"></div>

          {/* Header */}
          <header className="bg-gray-800 p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#FCFBF9]">Artemis</h1>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-6 w-6 text-purple-400" />
              </Button>
            </Link>
          </header>

          {/* Main Content */}
          <main className="h-[calc(100%-96px)] overflow-y-auto pb-16 text-gray-100">{children}</main>

          {/* Footer Navigation */}
          <div className="absolute bottom-0 left-0 w-full">
            <Navigation />
          </div>
        </div>
      </body>
    </html>
  );
}
