// Clerk middleware: allows public routes, enforces sign-in elsewhere, and redirects signed-in users without an org to /org-selection to preserve tenant scoping.
import {
  auth,
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
  // Require orgId on protected routes to enforce tenant scope.
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
