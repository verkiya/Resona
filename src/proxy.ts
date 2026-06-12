// Next.js Proxy for Clerk-backed route protection.
// Intercepts all page navigations to enforce authentication and organization-level scoping.
// Bypasses protection for public pages and API/tRPC routes (which implement their own guards).
// Redirects authenticated users missing an active organization to the /org-selection flow.
import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/learnings",
  "/test",
]);
const isOrgSelectionRoute = createRouteMatcher(["/org-selection(.*)"]);
export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  const isApiRoute = pathname.startsWith("/api") || pathname.startsWith("/trpc");

  if (isApiRoute) {
    return NextResponse.next();
  }

  const { userId, orgId } = await auth();
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  if (!userId) {
    await auth.protect();
  }
  if (isOrgSelectionRoute(req)) {
    return NextResponse.next();
  }
  // Protect against cross-tenant data leaks by enforcing organization scope.
  // If a user is signed in but hasn't selected an active organization,
  // we force them into the org-selection flow before accessing the dashboard.
  if (userId && !orgId) {
    const orgSelection = new URL("/org-selection", req.url);
    return NextResponse.redirect(orgSelection);
  }
  return NextResponse.next();
});
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
