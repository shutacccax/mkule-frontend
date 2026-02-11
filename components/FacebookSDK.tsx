"use client";

import { useEffect } from "react";

export default function FacebookSDK() {
  useEffect(() => {
    // Silence specific FB errors
    const originalError = console.error;

    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("ErrorUtils")
      ) {
        return;
      }

      originalError(...args);
    };

    const script = document.createElement("script");
    script.src =
      "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v24.0";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
