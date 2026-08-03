"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const GlobalLoading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulating checking auth state so the loader clears
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (!loading) return null;

  return (
    <div className="flex h-full items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <span className="ml-2 text-sm font-medium text-slate-600">GlobalLoading...</span>
    </div>
  );
};

export default GlobalLoading;