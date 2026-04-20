import {
  auth,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isOrgSelectionRoute = createRouteMatcher(["/org-selection(.*)"]);
export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();
  // Allowing public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  // Protecting non-public routes
  if (!userId) {
    await auth.protect();
  }
  //Allowing org selection page
  if (isOrgSelectionRoute(req)) {
    return NextResponse.next();
  }
  // For all protected routes, ensure organization is selected
  if (userId && !orgId) {
    const orgSelection = new URL("/org-selection", req.url);
    return NextResponse.redirect(orgSelection);
  }
  return NextResponse.next();
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
