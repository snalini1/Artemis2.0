"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    router.push("/safety"); // ✅ Redirect to Safety page on load
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-white"
      style={{
        backgroundImage: "url('/images/BG4.png')", // ✅ Ensure correct path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-3xl font-bold text-white-400 mb-4">Artemis AI</h1>
      <p className="text-purple-300">Your travel buddy</p>
      <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-4 border-purple-500 border-solid"></div>
    </div>
  );
}
