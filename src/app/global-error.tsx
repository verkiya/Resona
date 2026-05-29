// Global Error Boundary.
// Catches unhandled exceptions that escape the App Router.
// Captures stack traces to Sentry and renders a generic fallback UI to prevent a blank white screen.
"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* NextError enforces a numeric `statusCode` prop. Since App Router errors lack HTTP status codes, we pass `0` to render the generic fallback. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
