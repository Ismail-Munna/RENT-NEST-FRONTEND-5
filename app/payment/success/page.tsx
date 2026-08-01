"use client";

import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your rental request is now active and your booking has been confirmed.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard/tenant"
            className="bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
