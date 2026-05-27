// Global error boundary: reports failures to Sentry and renders Next's fallback error UI when the App Router crashes.
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
        {/* NextError requires a numeric status code, but App Router errors do not expose one, so 0 renders the generic fallback. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
