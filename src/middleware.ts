import { NextResponse } from "next/server";
import {
  authMiddleware,
  clerkMiddleware,
  createRouteMatcher,
  redirectToSignIn,
} from "@clerk/nextjs/server";

// Define routes that require authentication (protected routes)
// const isProtectedRoute = createRouteMatcher(["/organization(.*)"]);

// Middleware function to handle authentication
// export default clerkMiddleware(
//   (auth, req) => {
//     // If user is logged in (doesn't matter the user is accessing protected or unprotected route).
//     // just for information, I'm  considered landing page is unprotected.
//     if (
//       auth().userId &&
//       (req.nextUrl.pathname === "/" || isProtectedRoute(req))
//     ) {
//       // Determine the redirection path based on the user's organization ID availability
//       let redirectPath = "/select-org";
//       if (auth().orgId) {
//         redirectPath = `/organization/${auth().orgId}`;
//       }

//       // Redirect authenticated users to the determined path
//       const redirectURL = new URL(redirectPath, req.url);
//       return NextResponse.redirect(redirectURL);
//     }

//     // If user is not logged in (means logged out) and trying to access a protected route
//     if (!auth().userId && isProtectedRoute(req)) {
//       // Redirect to the sign-in page with the return URL set to the requested protected route
//       return auth().redirectToSignIn({ returnBackUrl: req.url });

//       // Redirect to the sign-in page
//       // auth().protect();
//     }
//   },
//   { debug: true }
// );

export default authMiddleware({
  // List of public routes
  publicRoutes: ["/"],
  afterAuth(auth, req) {
    // If user is authenticated and accessing a public route
    if (auth.userId && auth.isPublicRoute) {
      // Default path for organization selection
      let path = "/select-org";

      // If user is associated with an organization, update path
      if (auth.orgId) {
        `/organization/${auth.orgId}`;
      }

      // Construct URL for organization selection, and redirect
      const orgSelection = new URL(path, req.url);
      return NextResponse.redirect(orgSelection);
    }

    // If user is not authenticated and trying to access a non-public route, redirect user to sign-in page
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // If user is authenticated but not associated with any organization, redirect user to organization selection page
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const orgSelection = new URL("/select-org", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

// Configuration for middleware matcher
export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
