"use client";

import { useState } from "react";

interface PaymentButtonProps {
  invoiceUid: string;
}

interface CheckoutResponse {
  url?: string;
  error?: string;
}

export default function PaymentButton({
  invoiceUid,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handlePayment() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceUid,
        }),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to start payment.",
        );
      }

      if (!data.url) {
        throw new Error(
          "Stripe did not return a payment URL.",
        );
      }

      window.location.assign(data.url);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start payment. Please try again.",
      );

      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handlePayment}
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-700 px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isLoading ? "Opening secure checkout..." : "Pay securely"}
      </button>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-3 text-sm text-red-300"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}